from rest_framework import serializers
from goldLoan.models import *
from django.contrib.auth import get_user_model


User = get_user_model()


class PaymentSerializer(serializers.ModelSerializer):
    schemeCode = serializers.CharField(source='schemeCode.schemeCode')
    customer_name = serializers.CharField(source='schemeCode.Name')
    payment_method = serializers.CharField(source='get_payment_method_display')
    status = serializers.CharField(source='get_status_display')

    class Meta:
        model = Payment
        fields = [
            'id', 'schemeCode', 'customer_name', 'paymentDate', 
            'amountPaid', 'goldAdded', 'payment_method', 'status'
        ]


class UserSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    supabase_uid = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone_number', 'password', 'supabase_uid')
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def create(self, validated_data):
        # Create a new user with a hashed password
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password']  # Django will hash this automatically
        )
        
        # Save Supabase UID if provided
        if 'supabase_uid' in validated_data:
            user.supabase_uid = validated_data['supabase_uid']
            user.save()
            
        return user
    
class DateFieldWithoutTime(serializers.Field):
    def to_representation(self, value):
        # Convert datetime to date for representation
        return value.date()

    def to_internal_value(self, data):
        # Ensure the input is treated as a date
        return serializers.DateField().to_internal_value(data)


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


class JoinSchemeSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(write_only=True)  # Phone number is passed as a string

    class Meta:
        model = JoinScheme
        fields = ['id', 'Name', 'payAmount', 'chosenPackage', 'phone', 
                 'schemeCode', 'joiningDate', 'totalAmountPaid', 
                 'totalGold', 'NumberOfTimesPaid', 'remainingPayments']
        read_only_fields = ['schemeCode', 'joiningDate', 'totalAmountPaid', 
                           'totalGold', 'NumberOfTimesPaid', 'remainingPayments']

    def validate_phone(self, value):
        # Ensure the phone number is valid and corresponds to a User
        try:
            user = User.objects.get(phone_number=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(f"User with phone number {value} not found.")
        return user  # Return the User instance

    def create(self, validated_data):
        # Extract the User instance from validated_data
        user = validated_data.pop('phone')
        
        # Ensure payAmount is greater than 500
        if validated_data['payAmount'] <= 500:
            raise serializers.ValidationError("Amount must be greater than 500.")
        
        # Create the JoinScheme instance with the User instance
        return JoinScheme.objects.create(phone=user, **validated_data)
    
class FeedSerializers(serializers.ModelSerializer):
    class Meta:
        model = Feeds
        fields = ('id', 'feedsTitle', 'image', 'context', 'created_at', 'joiningDate')


class LivePriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LivePrice
        fields = '__all__'