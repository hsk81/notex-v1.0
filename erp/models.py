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

    class Meta:
        verbose_name_plural = 'Currencies'

    code = CharField (max_length=3, unique=True)
    name = CharField (max_length=256)

    def __unicode__ (self):
        return u'%s' % self.code

class MONEY (Model):

    class Meta:
        verbose_name_plural = 'Money'

    value = DecimalField (max_digits=16, decimal_places=8)
    currency = ForeignKey (CURRENCY)

    def __unicode__ (self):
        return u'%s %s' % (self.value, self.currency)

class TRANSACTION (Model):

    timestamp = DateTimeField (auto_now_add=True)
    to_contact = ForeignKey (CONTACT, related_name='in_transactions')
    from_contact = ForeignKey (CONTACT, related_name='out_transactions',
        blank=True, null=True)
    money = OneToOneField (MONEY)

    def __unicode__ (self):
        return u'[%s] %s -> %s: %s' % (
            self.timestamp, self.from_contact, self.to_contact, self.money)

class BTC_TRANSACTION (TRANSACTION):

    class Meta:
        verbose_name_plural = 'BTC Transactions'
        verbose_name = 'BTC Transaction'

    transaction_hash = CharField (max_length=256, unique=True)
    confirmations = PositiveSmallIntegerField (default=0)
    anonymous = BooleanField (default=False)

    def __unicode__ (self):
        return u'[%s] %s -> %s: %s @ [%s]' % (
            self.timestamp, self.from_contact, self.to_contact, self.money,
            self.confirmations)

class PRODUCT (Model):

    uuid = CharField (max_length=36, unique=True)
    price = OneToOneField (MONEY)

    name = property (lambda self: self.properties.get (type='name'))
    path = property (lambda self: self.properties.get (type='path'))

    def __unicode__ (self):
        return u'%s' % self.id

class PROPERTY (Model):

    class Meta:
        verbose_name_plural = 'Properties'

    type = CharField (max_length=256)
    value =  CharField (max_length=256)
    product = ForeignKey (PRODUCT, related_name='properties')

    def __unicode__ (self):
        return '%s' % self.value

class ITEM (Model):

    product_name = property (lambda self: self.product.name)
    product = ForeignKey (PRODUCT, related_name='items')
    price = OneToOneField (MONEY)

    def __unicode__ (self):
        return '%s @ %s' % (self.product.name, self.price)

class ORDER (Model):

    timestamp = DateTimeField (auto_now_add=True)
    from_contact = ForeignKey (CONTACT, related_name='out_orders', blank=True)
    to_contact = ForeignKey (CONTACT, related_name='in_orders')
    transaction = ForeignKey (TRANSACTION, null=True, related_name='orders')

    processed_timestamp = DateTimeField (blank=True, null=True)
    processed = property (lambda self: bool (self.processed_timestamp))

    nop = property (lambda self: self.positions.count ())
    total = property (lambda self: self.positions
        .values('price__currency__code').annotate (Sum ('price__value')))

    def __unicode__ (self):
        return u'%s' % self.id

class ORDER_POSITION (ITEM):

    class Meta:
        verbose_name = 'Order Position'
        verbose_name_plural = 'Order Positions'

    order = ForeignKey (ORDER, related_name='positions')

################################################################################
################################################################################
