from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('update-live-price/', views.update_live_price, name='update_live_price'),

    path('initiate-payment/<int:scheme_id>/', views.initiate_payment, name='initiate_payment'),
    path('payment-success/<int:scheme_id>/', views.payment_success, name='payment_success'),

    path('schemes/', views.scheme_list, name='scheme_list'),
    path('create-scheme/', views.create_scheme, name='create_scheme'),
    path('scheme-details/<int:scheme_id>/', views.scheme_details, name='scheme_details'),

    path('feeds/', views.show_feeds, name='show_feeds'),
    path('feeds/add/', views.add_feeds, name='add_feeds'),
    path('delete-feed/<int:feed_id>/', views.delete_feed, name='delete_feed'),

    path('users/', views.show_users, name='show_users'),
    path("users/add", views.add_users, name='add_users'),
    
    path('transation/', views.show_transation, name='show_transation'),  # Keeping your original URL name
    path('transactions/payment/<int:payment_id>/', views.payment_detail, name='payment_detail'),
    path('transactions/export/', views.export_payments, name='export_payments'),
]