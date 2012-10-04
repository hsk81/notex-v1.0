__author__ = "hsk81"
__date__ = "$Oct 03, 2012 11:43:15 PM$"

################################################################################
################################################################################

from django.db.models import *

################################################################################
################################################################################

class CONTACT (Model):

    fullname =  CharField (max_length=256, blank=True)
    email = EmailField (max_length=256, unique=True, null=True)

    def __unicode__ (self):
        return u'%s' % self.email

class CURRENCY (Model):

    code = CharField (max_length=3, unique=True)
    name = CharField (max_length=256)

    def __unicode__ (self):
        return u'%s' % self.code

class MONEY (Model):

    value = DecimalField (max_digits=16, decimal_places=8)
    currency = ForeignKey (CURRENCY)

    def __unicode__ (self):
        return u'%s %s' % (self.value, self.currency)

class TRANSACTION (Model):

    timestamp = DateTimeField (auto_now_add=False)
    to_contact = ForeignKey (CONTACT, related_name='in_transactions')
    from_contact = ForeignKey (CONTACT, related_name='out_transactions', blank=True)
    money = ForeignKey (MONEY)

    def __unicode__ (self):
        return u'[%s] %s -> %s: %s' % (
            self.timestamp, self.from_contact, self.to_contact, self.money)

class BTC_TRANSACTION (TRANSACTION):

    transaction_hash = CharField (max_length=256, unique=True)
    confirmations = PositiveSmallIntegerField (default=0)
    anonymous = BooleanField (default=False)

    def __unicode__ (self):
        return u'[%s] %s -> %s: %s @ %s' % (
            self.timestamp, self.from_contact, self.to_contact, self.money,
            self.confirmations)

class PRODUCT (Model):

    uuid = CharField (max_length=36, unique=True)
    price = ForeignKey (MONEY)

    def __unicode__ (self):
        return u'%s' % self.properties.get (type='name')

class PROPERTY (Model):

    type = CharField (max_length=256, unique=True)
    value =  CharField (max_length=256)
    product = ForeignKey (PRODUCT, related_name='properties')

    def __unicode__ (self):
        return '%s' % self.value

class ITEM (Model):

    product = ForeignKey (PRODUCT, related_name = 'items')
    price = ForeignKey (MONEY)

    def __unicode__ (self):
        return '%s @ %s' % (self.product, self.price)

class ORDER (Model):

    timestamp = DateTimeField (auto_now_add=False)
    to_contact = ForeignKey (CONTACT, related_name='in_orders')
    from_contact = ForeignKey (CONTACT, related_name='out_orders', blank=True)
    total = property (lambda self: self.positions.aggregate (Sum ('price')))

    def __unicode__ (self):
        return u'[%s] @ %s' % (self.timestamp, self.total)

class ORDER_POSITION (ITEM):

    order = ForeignKey (ORDER, related_name='positions')

class RECEIPT (Model):

    timestamp = DateTimeField (auto_now_add=False)
    uuid = CharField (max_length=36, unique=True)
    order = ForeignKey (ORDER)

    def __unicode__ (self):
        return u'[%s] @ %s' % (self.timestamp, self.order.total)

################################################################################
################################################################################
