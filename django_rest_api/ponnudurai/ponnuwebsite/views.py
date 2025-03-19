from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'home.html')

def about(request):
    return render(request, 'about.html')


def shop_view(request):
    return render(request, 'about.html')

def terms_and_condition(request):
    return render(request, 'termsAndCondition.html')


# for Websit privacyPolicy
def privacy_policy(request):
    return render(request, 'privacyPolicy.html')

def contact(request):
    return render(request, 'contact.html')

def products(request):
    return render(request, 'product.html')