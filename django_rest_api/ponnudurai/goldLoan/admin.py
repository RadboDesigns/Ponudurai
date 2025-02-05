from django.contrib import admin
from .models import *

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'phone')

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