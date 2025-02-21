from rest_framework import serializers
from goldLoan.models import *
from django.contrib.auth import get_user_model


User = get_user_model()



class UserSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(required=True)
    
    class Meta:
        model = User
        fields = ('id', 'phone_number', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
        }

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