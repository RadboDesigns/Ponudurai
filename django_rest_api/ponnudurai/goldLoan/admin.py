from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import *
from django.utils.html import format_html

class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'phone_number', 'role')
    list_filter = ('role',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('email', 'phone_number', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'phone_number', 'role', 'password1', 'password2'),
        }),
    )

    def has_add_permission(self, request):
        # Only super users can add admin users
        return request.user.is_super_user()

    def has_delete_permission(self, request, obj=None):
        # Only super users can delete admin users
        return request.user.is_super_user()

admin.site.register(User, UserAdmin)

@admin.register(JoinScheme)
class JoinSchemeAdmin(admin.ModelAdmin):
    list_display = ('Name', 'schemeCode', 'joiningDate', 'chosenPackage')
    
    fields = ('Name', 'phone', 'Address', 'chosenPackage', 'payAmount', 'joiningDate', 'totalAmountPaid', 'totalGold', 'NumberOfTimesPaid', 'remainingPayments')
    # Add this to make scheme code read-only
    readonly_fields = ('schemeCode',)

@admin.register(Feeds)
class feedsAdmin(admin.ModelAdmin):
    list_display = ('feedsTitle', 'created_at')


@admin.register(LivePrice)
class LivePriceAdmin(admin.ModelAdmin):
    list_display = ('id', 'display_gold_price', 'display_silver_price', 'timestamp', 'actions_buttons')
    list_per_page = 20
    search_fields = ('timestamp',)
    readonly_fields = ('timestamp',)
    ordering = ('-timestamp',)
    
    def display_gold_price(self, obj):
        return format_html('₹{:.2f}/g', obj.gold_price)
    display_gold_price.short_description = 'Gold Price'
    
    def display_silver_price(self, obj):
        return format_html('₹{:.2f}/g', obj.silver_price)
    display_silver_price.short_description = 'Silver Price'
    
    def actions_buttons(self, obj):
        """Custom actions column"""
        return format_html(
            '<a class="button" href="/admin/goldLoan/liveprice/{}/change/">Edit</a>',
            obj.id
        )
    actions_buttons.short_description = 'Actions'
    
    def get_queryset(self, request):
        """Limit queryset to most recent 100 records for performance"""
        qs = super().get_queryset(request)
        return qs[:100]
    
    def has_delete_permission(self, request, obj=None):
        """Allow deletion of old records"""
        return True

@admin.register(Payment)
class SchemePaymentAdmin(admin.ModelAdmin):
    list_display = ('schemeCode','amountPaid', 'goldAdded')