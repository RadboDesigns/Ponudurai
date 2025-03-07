from django.urls import path
from .views import *

urlpatterns = [
    path('live_prices/', LivePriceView.as_view(), name='live-prices'),
    path('health-check/', HealthCheckView.as_view(), name='health-check'),

    path('create-razorpay-order/', CreateRazorpayOrderView.as_view(), name='create-razorpay-order'),
    path('payment-success/', HandlePaymentSuccessView.as_view(), name='payment-success'),
    path('make-payment/', MakePaymentView.as_view(), name='make-payment'),
    path('scheme-payments/', SchemePaymentsView.as_view(), name='scheme-payments'),

    # User-related endpoints
    path('user/', UserView.as_view(), name='user'),
    path('user/check/', CheckUserView.as_view(), name='check-user-by-phone'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify/', verify_user, name='verify-user'),

    path('join_scheme/', JoinSchemeListCreateView.as_view(), name='join_scheme_view'),
    path('getSchemes/', GetSchemeListView.as_view(), name='get-schemes'),
    
    path('updateFeeds/', updateFeedsView.as_view(), name='update_feeds_view'),
    path('Feeds/', updateFeedsView.as_view(), name='update_feeds_view'),

    path('user-payments/', UserPaymentsView.as_view(), name='user-payments'),
]