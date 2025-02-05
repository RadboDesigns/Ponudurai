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
        phone_number = self.request.data.get('phone')
        if phone_number:
            serializer.save(phone=phone_number)

#              Scheme

class JoinSchemeListCreateView(generics.ListCreateAPIView):
    queryset = JoinScheme.objects.all()
    serializer_class = JoinSchemeSerializer

    def perform_create(self, serializer):
        serializer.save() 

class GetSchemeListView(generics.ListCreateAPIView):
    serializer_class = JoinSchemeSerializer
    
    def get_queryset(self):
        phone_number = self.request.query_params.get('phone', None)
        
        if phone_number:
            # Filter schemes where the related User's phone matches the query parameter
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

#             Payment
class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class GetPaymentView(generics.ListAPIView):
    pass

#              Feeds
class updateFeedsView(generics.ListCreateAPIView):
    queryset = Feeds.objects.all()
    serializer_class = FeedSerializers

    def perform_create(self, serializer):
        serializer.save()   

class getFeedsView(generics.ListCreateAPIView):
    data = Feeds.objects.all()
    serializer_class = FeedSerializers




