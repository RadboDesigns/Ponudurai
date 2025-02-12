from rest_framework import generics
from .serializers import *
from goldLoan.models import *
from rest_framework.response import Response
from rest_framework import status


class LivePriceView(generics.ListAPIView):
    serializer_class = LivePriceSerializer
    
    def get_queryset(self):
        # Get only the most recent price entry
        return LivePrice.objects.all().order_by('-timestamp')[:1]
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if queryset.exists():
            latest_price = queryset.first()
            return Response({
                'gold_price': float(latest_price.gold_price),
                'silver_price': float(latest_price.silver_price)
            })
        return Response({
            'gold_price': 0.0,
            'silver_price': 0.0
        })



class UserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def perform_create(self, serializer):
        email = self.request.data.get('email')
        password = self.request.data.get('password')
        if email and password:
            serializer.save(email=email, password=password)
#              Scheme

class JoinSchemeListCreateView(generics.ListCreateAPIView):
    queryset = JoinScheme.objects.all()
    serializer_class = JoinSchemeSerializer

    def perform_create(self, serializer):
        serializer.save() 

class GetSchemeListView(generics.ListCreateAPIView):
    serializer_class = JoinSchemeSerializer
    
    def get_queryset(self):
        # Check both request.data and query_params
        phone_number = (
            self.request.data.get('phone') or 
            self.request.query_params.get('phone')
        )
        
        print("Phone number:", phone_number)  # Keep this debug print
        
        if phone_number:
            return JoinScheme.objects.filter(phone__phone=phone_number).prefetch_related('payments')
        
        return JoinScheme.objects.none()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({
                "status": "error",
                "message": "No schemes found for this phone number"
            }, status=status.HTTP_404_NOT_FOUND)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "status": "success",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    
class MakePaymentView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    
    def calculate_gold_amount(self, amount_paid):
        try:
            # Get the latest gold price
            latest_price = LivePrice.objects.first()  # Gets most recent due to Meta ordering
            if not latest_price:
                raise ValueError("No gold price available")
            
            # Calculate gold amount (amount_paid / price_per_gram)
            gold_amount = float(amount_paid) / float(latest_price.gold_price)
            # Round to 3 decimal places
            return round(gold_amount, 3)
            
        except Exception as e:
            raise ValueError(f"Error calculating gold amount: {str(e)}")
    
    def create(self, request, *args, **kwargs):
        try:
            # Get scheme_code and amount from request data
            scheme_code = request.data.get('schemeCode')
            amount_paid = request.data.get('amountPaid')
            
            if not scheme_code or not amount_paid:
                return Response({
                    "status": "error",
                    "message": "Both schemeCode and amountPaid are required"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Find the scheme
            try:
                scheme = JoinScheme.objects.get(schemeCode=scheme_code)
            except JoinScheme.DoesNotExist:
                return Response({
                    "status": "error",
                    "message": "Invalid scheme code"
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Calculate gold amount
            try:
                gold_added = self.calculate_gold_amount(amount_paid)
            except ValueError as e:
                return Response({
                    "status": "error",
                    "message": str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create payment with calculated gold
            payment = Payment.objects.create(
                schemeCode=scheme,
                amountPaid=amount_paid,
                goldAdded=gold_added
            )
            
            # Update scheme's total gold
            scheme.totalGold += gold_added
            scheme.totalAmountPaid += int(amount_paid)
            scheme.save()
            
            # Return updated details
            scheme_serializer = JoinSchemeSerializer(scheme)
            payment_serializer = self.get_serializer(payment)
            
            latest_price = LivePrice.objects.first()
            
            return Response({
                "status": "success",
                "message": "Payment recorded successfully",
                "data": {
                    "payment": payment_serializer.data,
                    "updated_scheme": scheme_serializer.data,
                    "calculation_details": {
                        "amount_paid": amount_paid,
                        "gold_price_per_gram": str(latest_price.gold_price),
                        "gold_added": gold_added,
                        "current_total_gold": scheme.totalGold
                    }
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                "status": "error",
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

#             Payment
class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class SchemePaymentsView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    
    def get_queryset(self):
        scheme_code = self.request.data.get('scheme_code') or self.request.query_params.get('scheme_code')
        if scheme_code:
            return Payment.objects.filter(schemeCode__schemeCode=scheme_code).order_by('-paymentDate')
        return Payment.objects.none()
    
    def list(self, request, *args, **kwargs):
        # Check both request body and query params
        scheme_code = request.data.get('scheme_code') or request.query_params.get('scheme_code')
        
        print("Received scheme code:", scheme_code)  # Debug print
        
        if not scheme_code:
            return Response({
                "status": "error",
                "message": "Scheme code is required"
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            # First verify the scheme exists
            scheme = JoinScheme.objects.get(schemeCode=scheme_code)
            
            # Get payments
            queryset = self.get_queryset()
            if not queryset.exists():
                return Response({
                    "status": "error",
                    "message": "No payments found for this scheme"
                }, status=status.HTTP_404_NOT_FOUND)
                
            serializer = self.get_serializer(queryset, many=True)
            
            # Include scheme summary
            scheme_summary = {
                "scheme_code": scheme.schemeCode,
                "customer_name": scheme.Name,
                "total_payments_made": scheme.NumberOfTimesPaid,
                "remaining_payments": scheme.remainingPayments,
                "total_amount_paid": str(scheme.totalAmountPaid),
                "total_gold": str(scheme.totalGold)
            }
            
            return Response({
                "status": "success",
                "scheme_summary": scheme_summary,
                "payments": serializer.data
            }, status=status.HTTP_200_OK)
            
        except JoinScheme.DoesNotExist:
            return Response({
                "status": "error",
                "message": "Invalid scheme code"
            }, status=status.HTTP_404_NOT_FOUND)

#              Feeds
class updateFeedsView(generics.ListCreateAPIView):
    queryset = Feeds.objects.all()
    serializer_class = FeedSerializers

    def perform_create(self, serializer):
        serializer.save()   

class getFeedsView(generics.ListCreateAPIView):
    data = Feeds.objects.all()
    serializer_class = FeedSerializers




