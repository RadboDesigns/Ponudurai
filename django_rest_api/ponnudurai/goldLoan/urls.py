from django.urls import path
from . import views

urlpatterns = [
    path('', views.user_login, name='login'),
    path('logout/', views.logout_view, name='logout'),

    path('dashboard/', views.dashboard, name='dashboard'),

    path('live-price/', views.live_price_view, name='live_price_view'),
    path('update-live-price/', views.update_live_price, name='update_live_price'),
    path('price-history/', views.price_history, name='price_history'),

    path('initiate-payment/<int:scheme_id>/', views.initiate_payment, name='initiate_payment'),
    path('payment-success/<int:scheme_id>/', views.payment_success, name='payment_success'),
    path('process-cash-payment/', views.process_cash_payment, name='process_cash_payment'),

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

    path('admin-users/', views.admin_user_management, name='admin_user_management'),
    path('admin-users/create/', views.create_admin_user, name='create_admin_user'),
    path('admin-users/delete/<int:user_id>/', views.delete_admin_user, name='delete_admin_user'),
]