import calendar
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
from django.contrib.auth import get_user_model
from django.contrib import messages
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
import logging
from django.contrib.auth import logout
import json
from django.views.decorators.http import require_POST
from rest_framework import generics
from .tasks import update_live_prices
from django.utils import timezone
from datetime import datetime
from decimal import Decimal, InvalidOperation
from .forms import UserForm
from django.core.paginator import Paginator

client = razorpay.Client(auth=(settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET))
User = get_user_model()


@csrf_exempt
def process_cash_payment(request):
    try:
        data = json.loads(request.body)
        scheme_id = data.get('scheme_id')
        
        # Get the scheme
        scheme = JoinScheme.objects.get(id=scheme_id)
        
        # Fetch the latest gold price
        try:
            latest_prices = LivePrice.objects.first()
            gold_price = latest_prices.gold_price
        except Exception as e:
            gold_price = 8010  # Fallback value if gold price is not available

        # Calculate gold added based on the cash payment amount and round to 4 decimal places
        amount_paid = scheme.payAmount
        gold_added = round(amount_paid / gold_price, 4)  # Round to 4 decimal places

        # Create a new payment
        payment = Payment(
            schemeCode=scheme,
            paymentDate=timezone.now().date(),
            amountPaid=amount_paid,
            status='success',
            goldAdded=gold_added,  # Add gold equivalent for cash payment (rounded)
            payment_method='cash'  # Set payment method to cash
        )
        payment.save()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Cash payment processed successfully'
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        })
    
# Check if the user is a Super User
def is_super_user(user):
    return user.is_authenticated and user.is_super_user()

# Admin User Management View
@user_passes_test(is_super_user)
def admin_user_management(request):
    admin_users = User.objects.filter(role=User.Role.ADMIN)
    return render(request, 'admin_user_management.html', {'admin_users': admin_users})

# Create Admin User View
@user_passes_test(is_super_user)
def create_admin_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        phone_number = request.POST.get('phone_number')

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                phone_number=phone_number,
                role=User.Role.ADMIN,
                is_staff=True,  # Set is_staff to True for admin users
            )
            messages.success(request, 'Admin user created successfully!')
            return redirect('admin_user_management')
        except Exception as e:
            messages.error(request, f'Error creating admin user: {str(e)}')
    return render(request, 'create_admin_user.html')

# Delete Admin User View
@user_passes_test(is_super_user)
def delete_admin_user(request, user_id):
    user = get_object_or_404(User, id=user_id, role=User.Role.ADMIN)
    if request.method == 'POST':
        user.delete()
        messages.success(request, 'Admin user deleted successfully!')
        return redirect('admin_user_management')
    return render(request, 'confirm_delete_admin_user.html', {'user': user})

def show_transaction(request):
    # Get all payments ordered by the most recent first
    all_payments = Payment.objects.all().order_by('-paymentDate', '-id')
    print(f"Found {len(all_payments)} payments") 
    
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

        # Fetch the latest gold price
        try:
            response = requests.get(settings.LIVE_PRICE_API_URL)
            if response.status_code == 200:
                gold_price = latest_prices.gold_price
                print(gold_price)
        except Exception as e:
            gold_price = 8000  # Fallback value

        # Verify the payment
        try:
            payment = client.payment.fetch(payment_id)
            if payment['status'] == 'captured':
                # Calculate gold added based on the fetched gold rate
                gold_added = amount / gold_price

                # Create a Payment record
                # The Payment model's save method will update the scheme
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
def update_live_price_manual(request):
    if request.method == 'POST':
        try:
            gold_price = request.POST.get('gold_price')
            silver_price = request.POST.get('silver_price')

            if gold_price and silver_price:
                try:
                    # Convert to Decimal to ensure proper type
                    gold_price = Decimal(gold_price)
                    silver_price = Decimal(silver_price)
                    
                    # Create a new LivePrice entry
                    LivePrice.objects.create(
                        gold_price=gold_price,
                        silver_price=silver_price,
                        timestamp=timezone.now()
                    )
                    return JsonResponse({'status': 'success', 'message': 'Prices updated successfully!'})
                except (ValueError, InvalidOperation, TypeError) as e:
                    # Handle conversion errors
                    return JsonResponse({'status': 'error', 'message': f'Invalid number format: {str(e)}'}, status=400)
            else:
                return JsonResponse({'status': 'error', 'message': 'Gold price and silver price are required.'}, status=400)
        except Exception as e:
            # Log the exception for debugging
            print(f"Error in update_live_price: {str(e)}")
            return JsonResponse({'status': 'error', 'message': 'Server error occurred.'}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)


def show_live_price(request):
    latest_prices = LivePrice.objects.all()
    return render(request, 'index.html', {'latest_prices': latest_prices})


def dashboard(request):
    if not (request.user.is_superuser or request.user.is_staff):
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('login')
    
    # Get latest prices
    latest_prices = LivePrice.objects.order_by('-timestamp').first()
    
    # Calculate new customers count for the last month
    
    User = get_user_model()
    
    # Get the first day of the current month
    today = timezone.now()
    first_day_current_month = today.replace(day=1)
    
    # Calculate the first day of the previous month
    if first_day_current_month.month == 1:  # January
        prev_month = 12  # December
        prev_year = first_day_current_month.year - 1
    else:
        prev_month = first_day_current_month.month - 1
        prev_year = first_day_current_month.year
    
    # Get the last day of the previous month
    last_day_prev_month = first_day_current_month - timedelta(days=1)
    
    # Calculate the first day of the previous month
    first_day_prev_month = last_day_prev_month.replace(day=1)
    
    # Query for new customers joined in the previous month
    new_customers_count = User.objects.filter(
        date_joined__gte=first_day_prev_month,
        date_joined__lte=last_day_prev_month,
        is_superuser=False,  # Exclude admin users
        is_staff=False       # Exclude staff users
    ).count()
    
    # Get the month name for display
    prev_month_name = calendar.month_name[prev_month]
    
    return render(request, 'index.html', {
        'latest_prices': latest_prices,
        'new_customers_count': new_customers_count,
        'prev_month_name': prev_month_name
    })

def scheme_list(request):
    schemes = JoinScheme.objects.all()

    # Apply filters based on query parameters
    category = request.GET.get('category')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    scheme_code = request.GET.get('scheme_code')

    if category:
        schemes = schemes.filter(chosenPackage=category)

    if start_date:
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        schemes = schemes.filter(joiningDate__gte=start_date)

    if end_date:
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        schemes = schemes.filter(joiningDate__lte=end_date)

    if scheme_code:
        schemes = schemes.filter(schemeCode__icontains=scheme_code)

    context = {
        'schemes': schemes,
    }

    return render(request, 'schemes.html', context)

def process_card_payment(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            scheme_id = data.get('scheme_id')
            
            # Get the scheme
            scheme = JoinScheme.objects.get(id=scheme_id)
            
            # Get the current gold price from LivePrice model
            try:
                # Get the most recent gold price (first one due to ordering in Meta)
                current_price = LivePrice.objects.first()
                if not current_price:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'Current gold price not available.'
                    })
                gold_price = current_price.gold_price
            except LivePrice.DoesNotExist:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Gold price information not available.'
                })
            
            # Calculate gold added based on current gold price and round to 4 decimal places
            gold_added = round(float(scheme.payAmount) / float(gold_price), 4)
            
            # Create payment with payment_method='poc'
            payment = Payment.objects.create(
                schemeCode=scheme,
                amountPaid=scheme.payAmount,
                goldAdded=gold_added,
                payment_method='poc',  # Set payment method to 'poc' for card payments
                status='success'
            )
            
            return JsonResponse({
                'status': 'success',
                'message': 'Card payment processed successfully.'
            })
            
        except JoinScheme.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Scheme not found.'
            })
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })
    
    return JsonResponse({
        'status': 'error',
        'message': 'Invalid request method.'
    })


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
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('show_users')  # Redirect to the user list page after creation
    else:
        form = UserForm()
    return render(request, 'add_users.html', {'form': form})

def show_transation(request):
    payments = Payment.objects.filter(status='success').order_by('-paymentDate', '-id')

    print(f"Number of payments fetched: {payments.count()}")  # Debug statement

    # Apply filters based on query parameters
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    payment_method = request.GET.get('payment_method')
    scheme_code = request.GET.get('scheme_code')

    if start_date:
        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        payments = payments.filter(paymentDate__gte=start_date)

    if end_date:
        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        payments = payments.filter(paymentDate__lte=end_date)

    if payment_method:
        payments = payments.filter(payment_method=payment_method)

    if scheme_code:
        payments = payments.filter(schemeCode__schemeCode__icontains=scheme_code)

    # Calculate summary data
    payment_count = payments.count()
    total_amount = sum(payment.amountPaid for payment in payments)
    total_gold = sum(payment.goldAdded for payment in payments)
    latest_payment = payments.order_by('-paymentDate').first()

    # Calculate today's, this week's, and this month's totals
    today_total = sum(payment.amountPaid for payment in payments.filter(paymentDate=datetime.today().date()))
    week_total = sum(payment.amountPaid for payment in payments.filter(paymentDate__week=datetime.today().isocalendar()[1]))
    month_total = sum(payment.amountPaid for payment in payments.filter(paymentDate__month=datetime.today().month))

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

logger = logging.getLogger(__name__)

def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            if user.is_superuser or user.is_staff or user.role == 'SUPERUSER':  # Check custom role too
                return redirect('dashboard')  # Redirect to dashboard
            else:
                messages.error(request, 'You do not have permission to access this page.')
                return redirect('login')
        else:
            messages.error(request, 'Invalid username or password.')
            return redirect('login')
    return render(request, 'login.html')


def logout_view(request):
    logout(request)
    messages.success(request, "You have been successfully logged out.")
    return redirect('login')


def live_price_view(request):
    """View to display the latest gold and silver prices"""
    try:
        # Get the latest price entry
        latest_prices = LivePrice.objects.order_by('-timestamp').first()
        
        # Context with the latest prices
        context = {
            'latest_prices': latest_prices,
        }
        
        # Render the template with the latest prices
        return render(request, 'your_template.html', context)
    except Exception as e:
        # Return error context 
        context = {
            'error': str(e),
            'latest_prices': None,
        }
        return render(request, 'your_template.html', context)

@csrf_exempt
def update_live_price(request):
    """Manual trigger for updating the prices"""
    try:
        # Run the Celery task synchronously for immediate response
        result = update_live_prices.delay()
        
        return JsonResponse({
            'status': 'success',
            'message': 'Price update task has been triggered',
            'task_id': result.id
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Failed to trigger price update: {str(e)}'
        }, status=500)

def price_history(request):
    """View to display historical price data"""
    # Get the last 30 price entries
    history = LivePrice.objects.order_by('-timestamp')[:30]
    
    return render(request, 'goldLoan/price_history.html', {
        'history': history
    })



def home(request):
    return render(request, 'home.html')

def privacy_policy(request):
    return render(request, 'privacy_policy.html')

def about_us(request):
    return render(request, 'about_us.html')


def terms_conditions(request):
    return render(request, 'terms_condition.html')

def contact(request):
    return render(request, 'contact_us.html')