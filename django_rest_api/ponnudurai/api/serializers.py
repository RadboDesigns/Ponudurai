from rest_framework import serializers
from goldLoan.models import *

class LivePriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LivePrice
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

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
    payments = PaymentSerializer(many=True, read_only=True)  # Nested serializer for payments

    class Meta:
        model = JoinScheme
        fields = '__all__'

class FeedSerializers(serializers.ModelSerializer):
    class Meta:
        model = Feeds
        fields = ('feedsTitle', 'image', 'context', 'created_at', 'joiningDate')