from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('terms-and-condition/', views.terms_and_condition, name='terms_and_condition'),
    path('Privacy-Policy/', views.privacy_policy, name='privacy_policy'),
    path('Contact/', views.contact, name='contact'),
    path('Our-Products/', views.products, name='products'),
    path('Login/', views.login, name='login'),

    path('shop/', views.shop_view, name='shop'),
]