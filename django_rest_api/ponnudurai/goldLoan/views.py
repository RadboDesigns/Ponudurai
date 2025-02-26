import os
from pyexpat.errors import messages
from django.shortcuts import render, get_object_or_404
from django.shortcuts import redirect, render
from goldLoan.models import *  # Import from api app if models are there
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
import razorpay
from django.conf import settings
import requests

client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET))

def show_transaction(request):
    # Get all payments ordered by the most recent first
    all_payments = Payment.objects.all().order_by('-paymentDate', '-id')
    
    # Pagination
    paginator = Paginator(all_payments, 10)  # Show 10 payments per page
    page_number = request.GET.get('page')
    payments = paginator.get_page(page_number)
    
    # Calculate summary statistics
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    payment_count = Payment.objects.count()
    total_amount = Payment.objects.aggregate(total=Sum('amountPaid'))['total'] or 0
    total_gold = Payment.objects.aggregate(total=Sum('goldAdded'))['total'] or 0
    
    latest_payment = Payment.objects.order_by('-paymentDate', '-id').first()
    
    today_total = Payment.objects.filter(paymentDate=today).aggregate(total=Sum('amountPaid'))['total'] or 0
    week_total = Payment.objects.filter(paymentDate__gte=week_ago).aggregate(total=Sum('amountPaid'))['total'] or 0
    month_total = Payment.objects.filter(paymentDate__gte=month_ago).aggregate(total=Sum('amountPaid'))['total'] or 0
    
    context = {
        'payments': payments,
        'payment_count': payment_count,
        'total_amount': total_amount,
        'total_gold': total_gold,
        'latest_payment': latest_payment,
        'today_total': today_total,
        'week_total': week_total,
        'month_total': month_total,
    }
    
    return render(request, 'transactions.html', context)

def payment_detail(request, payment_id):
    payment = Payment.objects.get(id=payment_id)
    
    # If JoinScheme has a field 'payment'
    try:
        scheme = JoinScheme.objects.get(payment=payment)
    except JoinScheme.DoesNotExist:
        # Handle the case where no scheme exists for this payment
        scheme = None
    
    context = {
        'payment': payment,
        'scheme': scheme,
        'transaction': Payment.objects.all()
    }
    return render(request, 'payment_detail.html', context)

def export_payments(request):
    # This function would handle exporting payment data to CSV/Excel
    # Implementation would depend on your requirements
    pass


def scheme_details(request, scheme_id):
    scheme = get_object_or_404(JoinScheme, id=scheme_id)
    return JsonResponse({
        'schemeCode': scheme.schemeCode,
        'Name': scheme.Name,
        'phone': scheme.phone.phone_number,  # Assuming phone_number is a field in the User model
        'payAmount': float(scheme.payAmount),
        'totalAmountPaid': float(scheme.totalAmountPaid),
        'totalGold': float(scheme.totalGold),
        'NumberOfTimesPaid': scheme.NumberOfTimesPaid,
        'remainingPayments': scheme.remainingPayments,
    })


@csrf_exempt
def initiate_payment(request, scheme_id):
    scheme = get_object_or_404(JoinScheme, id=scheme_id)
    amount = int(scheme.payAmount * 100)  # Convert to paise (Razorpay expects amount in the smallest currency unit)

    # Create a Razorpay order
    order = client.order.create({
        'amount': amount,
        'currency': 'INR',
        'payment_capture': 1  # Auto-capture payment
    })

    return JsonResponse({
        'order_id': order['id'],
        'amount': amount,
        'currency': 'INR',
        'key': settings.RAZORPAY_API_KEY,
    })


@csrf_exempt
def payment_success(request, scheme_id):
    if request.method == 'POST':
        scheme = get_object_or_404(JoinScheme, id=scheme_id)
        payment_id = request.POST.get('razorpay_payment_id')
        order_id = request.POST.get('razorpay_order_id')
        latest_prices = LivePrice.objects.first()
        amount = float(request.POST.get('amount')) / 100  # Convert back to rupees

        # Fetch the latest gold price from the LivePriceView API
        try:
            response = requests.get(settings.LIVE_PRICE_API_URL) # Replace with your actual API URL
            if response.status_code == 200:
                gold_price = latest_prices.gold_price
                print(gold_price)
            else:
                gold_price = 8000  # Fallback value if the API fails
        except Exception as e:
            gold_price = 8000  # Fallback value if there's an error

        # Verify the payment
        try:
            payment = client.payment.fetch(payment_id)
            if payment['status'] == 'captured':
                # Update the scheme's payment details
                scheme.totalAmountPaid += amount
                scheme.NumberOfTimesPaid += 1
                scheme.remainingPayments = max(0, scheme.remainingPayments - 1)

                # Calculate gold added based on the fetched gold rate
                gold_added = amount / gold_price
                scheme.totalGold += gold_added

                scheme.save()

                # Create a Payment record
                Payment.objects.create(
                    schemeCode=scheme,
                    amountPaid=amount,
                    goldAdded=gold_added,
                    razorpay_payment_id=payment_id,
                    razorpay_order_id=order_id,
                )

                return JsonResponse({'status': 'success', 'message': 'Payment successful!'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Payment not captured.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)

@csrf_exempt
def create_scheme(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        package = request.POST.get('package')
        pay_amount = request.POST.get('payAmount')

        try:
            user = User.objects.get(phone_number=phone)
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found.'}, status=400)

        # Create the new scheme
        JoinScheme.objects.create(
            Name=name,
            phone=user,
            Address=address,
            chosenPackage=package,
            payAmount=pay_amount,
        )

        return JsonResponse({'status': 'success', 'message': 'Scheme created successfully!'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)

@csrf_exempt
def update_live_price(request):
    if request.method == 'POST':
        gold_price = request.POST.get('gold_price')
        silver_price = request.POST.get('silver_price')

        if gold_price and silver_price:
            # Create a new LivePrice entry
            LivePrice.objects.create(
                gold_price=gold_price,
                silver_price=silver_price,
                timestamp=timezone.now()
            )
            return JsonResponse({'status': 'success', 'message': 'Prices updated successfully!'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid data provided.'}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)


def dashboard(request):
    latest_prices = LivePrice.objects.first()  
    print(latest_prices)
    return render(request, 'index.html', {'latest_prices': latest_prices})

def scheme_list(request):
    category = request.GET.get('category')
    date = request.GET.get('date')

    schemes = JoinScheme.objects.all()

    if category:
        schemes = schemes.filter(chosenPackage=category)
    if date:
        schemes = schemes.filter(joiningDate=date)

    return render(request, 'schemes.html', {'schemes': schemes})

def show_feeds(request):
    feeds = Feeds.objects.all()
    return render(request, 'showFeeds.html', {'feeds': feeds})

def add_feeds(request):
    if request.method == 'POST':
        feeds_title = request.POST.get('feedsTitle')
        context_text = request.POST.get('context')
        image_file = request.FILES.get('image') if 'image' in request.FILES else None

        new_feeds = Feeds(
            feedsTitle = feeds_title,
            context = context_text,
            image = image_file
        )
        new_feeds.save()
        return redirect('show_feeds')
    return render(request, 'feeds.html')


def delete_feed(request, feed_id):
    try:
        feed = Feeds.objects.get(id=feed_id)
        
        # Delete the image file from storage if it exists
        if feed.image and feed.image.path:
            if os.path.isfile(feed.image.path):
                os.remove(feed.image.path)
        
        # Delete the feed record
        feed.delete()
        messages.success(request, "Feed deleted successfully!")
    except Feeds.DoesNotExist:
        messages.error(request, "Feed not found!")
    except Exception as e:
        messages.error(request, f"Error deleting feed: {str(e)}")
    
    return redirect('show_feeds')


def show_users(request):
    users = User.objects.all()
    print(users)
    return render(request, 'users.html', {'users': users})

def add_users(request):
    pass

def show_transation(request):
    transation = Payment.objects.all()
    return render(request, 'transactions.html', {'transaction': transation})

