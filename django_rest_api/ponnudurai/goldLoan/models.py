from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.db.models import F

class User(models.Model):
    phone = models.CharField(max_length=15, unique=True)

    def __str__(self):
        return self.phone
    

class LivePrice(models.Model):
    gold_price = models.DecimalField(max_digits=10, decimal_places=2)
    silver_price = models.DecimalField(max_digits=10, decimal_places=2)  # Fixed typo in field name
    timestamp = models.DateTimeField(default=timezone.now)  # Added timestamp for tracking price changes

    class Meta:
        verbose_name = 'Live Price'
        verbose_name_plural = 'Live Prices'
        ordering = ['-timestamp']  # Most recent prices first

    def __str__(self) -> str:
        return f"Gold: {self.gold_price}, Silver: {self.silver_price}"


def get_current_date():
    return timezone.now().date()

class JoinScheme(models.Model):
    PACKAGE_CHOICES = (
        ('Daily', 'Daily'),
        ('Weekly', 'Weekly'),
        ('Monthly', 'Monthly'),
    )

    chosenPackage = models.CharField(
        max_length=10,
        choices=PACKAGE_CHOICES,
        default='Monthly'
    )
    payAmount = models.DecimalField(max_digits=10, decimal_places=2)
    Name = models.CharField(max_length=255)
    phone = models.ForeignKey(User, on_delete=models.CASCADE, related_name='join_schemes')
    Address = models.TextField()
    schemeCode = models.CharField(max_length=20, unique=True, editable=False)
    joiningDate = models.DateField(default=get_current_date)
    totalAmountPaid = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    totalGold = models.FloatField(default=0.0, validators=[MinValueValidator(0.0)])
    NumberOfTimesPaid = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    remainingPayments = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    def __str__(self):
        return f"{self.Name} - {self.schemeCode}"

    def save(self, *args, **kwargs):
        # Set initial number of payments based on package
        is_new = not self.pk  # Check if this is a new instance
        
        if is_new:
            if self.chosenPackage == 'Daily':
                self.remainingPayments = 365
            elif self.chosenPackage == 'Weekly':
                self.remainingPayments = 52
            elif self.chosenPackage == 'Monthly':
                self.remainingPayments = 12

        # Generate schemeCode if it doesn't exist
        if not self.schemeCode:
            current_year = timezone.now().year
            count = JoinScheme.objects.filter(joiningDate__year=current_year).count() + 1
            self.schemeCode = f"PON{current_year}{count:04d}"

        super().save(*args, **kwargs)

class Payment(models.Model):
    schemeCode = models.ForeignKey(JoinScheme, on_delete=models.CASCADE, related_name='payments')
    paymentDate = models.DateField(default=get_current_date)
    amountPaid = models.DecimalField(max_digits=10, decimal_places=2)
    goldAdded = models.FloatField(default=0.0, validators=[MinValueValidator(0.0)])

    def save(self, *args, **kwargs):
        is_new = not self.pk  # Check if this is a new payment
        
        if is_new:
            # Update the scheme's total amounts
            scheme = self.schemeCode
            scheme.NumberOfTimesPaid += 1
            scheme.remainingPayments = max(0, scheme.remainingPayments - 1)
            scheme.save()
            
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Update the scheme's totals when a payment is deleted
        scheme = self.schemeCode
        scheme.NumberOfTimesPaid -= 1
        scheme.remainingPayments += 1
        scheme.save()
        
        super().delete(*args, **kwargs)

    def __str__(self):
        return f"Payment for {self.schemeCode.schemeCode} on {self.paymentDate}"

class Feeds(models.Model):
    feedsTitle = models.CharField(max_length=125)
    image = models.ImageField(
        upload_to='feeds/%Y/%m/%d/',
        blank=True,
        null=True
    )
    context = models.TextField(
        help_text="Content of the feed post"
    )
    created_at = models.DateTimeField(default=timezone.now)
    joiningDate = models.DateField(default=get_current_date)

    class Meta:
        ordering = ['-created_at']