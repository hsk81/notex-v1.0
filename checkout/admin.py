__author__ ="hsk81"
__date__ ="$Oct 04, 2012 10:04:45 PM$"

################################################################################
################################################################################

from django.contrib import admin
from models import *

################################################################################
################################################################################

class CONTACTAdmin (admin.ModelAdmin):

    search_fields = ['id', 'fullname', 'email']
    list_display = ('id', 'fullname', 'email')

admin.site.register (CONTACT, CONTACTAdmin)

class CURRENCYAdmin (admin.ModelAdmin):

    search_fields = ['id', 'name', 'code']
    list_display = ('id', 'name', 'code')

admin.site.register (CURRENCY, CURRENCYAdmin)

class MONEYAdmin (admin.ModelAdmin):

    search_fields = ['id', 'value', 'currency__code', 'currency__name']
    list_display = ('id', 'value', 'currency')

admin.site.register (MONEY, MONEYAdmin)

class TRANSACTIONAdmin (admin.ModelAdmin):

    search_fields = [
        'id', 'timestamp', 'from_contact__fullname', 'from_contact__email',
        'to_contact__fullname', 'to_contact__email', 'money__value',
        'money__currency__code', 'money__currency__name']
    list_display = ('id', 'timestamp', 'from_contact', 'to_contact', 'money')

admin.site.register (TRANSACTION, TRANSACTIONAdmin)

class BTC_TRANSACTIONAdmin (admin.ModelAdmin):

    search_fields = [
        'id', 'timestamp', 'from_contact__fullname', 'from_contact__email',
        'to_contact__fullname', 'to_contact__email', 'money__value',
        'money__currency__code', 'money__currency__name', 'confirmations',
        'transaction_hash', 'anonymous']
    list_display = (
        'id', 'timestamp', 'from_contact', 'to_contact', 'money',
        'confirmations', 'transaction_hash', 'anonymous')

admin.site.register (BTC_TRANSACTION, BTC_TRANSACTIONAdmin)

class PRODUCTAdmin (admin.ModelAdmin):

    search_fields = [
        'id', 'uuid', 'price__value', 'price__currency__code',
        'price__currency__name']
    list_display = ('id', 'uuid', 'name', 'path', 'price')

admin.site.register (PRODUCT, PRODUCTAdmin)

class PROPERTYAdmin (admin.ModelAdmin):

    search_fields = ['id', 'type', 'value', 'product__id']
    list_display = ('id', 'type', 'value', 'product')

admin.site.register (PROPERTY, PROPERTYAdmin)

class ITEMAdmin (admin.ModelAdmin):

    search_fields = [
        'id', 'product__id', 'price__value', 'price__currency__code',
        'price__currency__name']
    list_display = ('id', 'product', 'product_name', 'price')

admin.site.register (ITEM, ITEMAdmin)

class ORDERAdmin (admin.ModelAdmin):

    search_fields = [
        'id', 'timestamp', 'from_contact__fullname', 'from_contact__email',
        'to_contact__fullname', 'to_contact__email']
    list_display = (
        'id', 'timestamp', 'from_contact', 'to_contact', 'nop', 'price')

admin.site.register (ORDER, ORDERAdmin)

class ORDER_POSITIONAdmin (admin.ModelAdmin):

    search_fields = [
        'id', 'product__id', 'price__value', 'price__currency__code',
        'price__currency__name', 'order__id']
    list_display = ('id', 'product', 'product_name', 'price', 'order')

admin.site.register (ORDER_POSITION, ORDER_POSITIONAdmin)

################################################################################
################################################################################
