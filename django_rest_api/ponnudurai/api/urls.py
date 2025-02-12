from django.urls import path

from .views import *

urlpatterns = [
    path('live_prices/', LivePriceView.as_view(), name='live-prices'),
    path('user/', UserView.as_view(), name='user_view'),
    path('join_scheme/', JoinSchemeListCreateView.as_view(), name='join_scheme_view'),
    path('getSchemes/', GetSchemeListView.as_view(), name='get_scheme'),
    path('updateFeeds/', updateFeedsView.as_view(), name='update_feeds_view'),
    path('Feeds/', updateFeedsView.as_view(), name='update_feeds_view'),
    path('make-payment/', MakePaymentView.as_view(), name='make-payment'),
    path('scheme-payments/', SchemePaymentsView.as_view(), name='scheme-payments'),
    #path('todos/<int:pk>/', TodoDetail.as_view(), name='todo_detail'),
]