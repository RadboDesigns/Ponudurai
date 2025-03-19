from django import forms
from django.core.validators import RegexValidator
from .models import User

class UserForm(forms.ModelForm):
    # Add validation for phone number directly in the form
    phone_number = forms.CharField(
        max_length=10,
        min_length=10,
        validators=[
            RegexValidator(
                regex=r'^\d{10}$',
                message="Phone number must be exactly 10 digits."
            )
        ],
        widget=forms.TextInput(attrs={'placeholder': '9999999999'})
    )
    
    # Override the username field to allow dots and spaces
    username = forms.CharField(
        max_length=150,
        validators=[
            RegexValidator(
                regex=r'^[A-Za-z0-9\s\.\-]+$',
                message="Username can contain letters, numbers, spaces, dots, and hyphens."
            )
        ],
        widget=forms.TextInput(attrs={'placeholder': 'S. Ajay Rahul'})
    )
    
    class Meta:
        model = User
        fields = ['username', 'phone_number']
    
    def clean_phone_number(self):
        phone = self.cleaned_data.get('phone_number')
        if phone and len(phone) != 10:
            raise forms.ValidationError("Phone number must be exactly 10 digits.")
        return phone
