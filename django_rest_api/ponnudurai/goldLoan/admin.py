from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import *

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

@admin.register(Feeds)
class feedsAdmin(admin.ModelAdmin):
    list_display = ('feedsTitle', 'created_at')


@admin.register(LivePrice)
class LivePriceAdmin(admin.ModelAdmin):
    list_display = ('gold_price', 'silver_price', 'timestamp')  # Fixed tuple syntax
    list_filter = ('timestamp',)
    readonly_fields = ('timestamp',)

@admin.register(Payment)
class SchemePaymentAdmin(admin.ModelAdmin):
    list_display = ('schemeCode','amountPaid', 'goldAdded')