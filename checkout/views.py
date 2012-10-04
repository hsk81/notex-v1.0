__author__ = "hsk81"
__date__ = "$Oct 03, 2012 5:48:30 PM$"

################################################################################
################################################################################

from django.conf import settings
from django.http import HttpResponse
from uuid import uuid4 as uuid_random
from checkout.models import *

import socket
import os.path
import logging

################################################################################
################################################################################

logger = logging.getLogger (__name__)

################################################################################
################################################################################

def transact (request):

    test = bool (request.GET.get ('test', 'false').lower () != 'false')
    address = request.GET.get ('address', None)

    transaction_hash = request.GET.get ('transaction_hash', None)
    value = int (request.GET.get ('value', '0')) ## 1 Satoshi is 1E8 BTC
    confirmations = int (request.GET.get ('confirmations', '0'))
    anonymous = bool (request.GET.get ('anonymous', 'false').lower () != 'false')

    fullname = request.GET.get ('name', '')
    email = request.GET.get ('mail', None)
    product_uuid = request.GET.get ('uuid', None)

    if settings.DEBUG and test:
        content = 'debug: %s, test: %s' % (settings.DEBUG, test)
        logger.error (content); return HttpResponse (content)

    if address != settings.CHECKOUT_RECVADDR:
        content = 'address: %s != %s' % (address, settings.CHECKOUT_RECVADDR)
        logger.error (content); return HttpResponse (content)

    name, aliases, ips = socket.gethostbyname_ex (settings.CHECKOUT_NOTIFIER)
    if not settings.DEBUG and test: ips.append (settings.CHECKOUT_TESTADDR)

    if not settings.DEBUG and name != settings.CHECKOUT_NOTIFIER:
        content = 'name: %s != %s' % (name, settings.CHECKOUT_NOTIFIER)
        logger.error (content); return HttpResponse (content)

    if not settings.DEBUG and not request.META['REMOTE_ADDR'] in ips:
        content = 'REMOTE_ADDR: %s not in %s' % (request.META['REMOTE_ADDR'], ips)
        logger.error (content); return HttpResponse (content)

    ##
    ## Make sure to store the transaction, since after the above checks it is
    #  for *sure* that the bitcoin transaction happened!
    ##

    currency = CURRENCY.get (code = 'BTC')
    to_contact = CONTACT.get (email = 'contact@blackhan.ch')
    from_contact, _ = CONTACT.get_or_create (email = email, defaults = {
        'fullname': fullname})

    try:
        transaction = BTC_TRANSACTION.objects.get (
            transaction_hash = transaction_hash)
    except:
        transaction = BTC_TRANSACTION.objects.create (
            transaction_hash = transaction_hash,
            confirmations = confirmations,
            anonymous = anonymous,
            to_contact = to_contact,
            from_contact = from_contact,
            money = MONEY.create (currency = currency, value = value))
    else:
        transaction.confirmations = confirmations
        transaction.save ()

    logger.info ('%s: confirmation = %s' % (transaction_hash, confirmations))
    if confirmations == 0: return HttpResponse ("confirmations: 0")

    try: product = PRODUCT.objects.get (uuid = product_uuid)
    except: product = None
    if not product: return HttpResponse ("product: None")

    return process (from_contact, to_contact, product)

def process (from_contact, to_contact, product):

    order = ORDER.objects.create (
        from_contact = from_contact, to_contact = to_contact)
    price = MONEY.objects.create (
        value = product.price.value, currency = product.price.currency)
    position = ORDER_POSITION.objects.create (
        order = order, product = product, price = price)
    receipt = RECEIPT.objects.create (
        uuid = uuid_random (), order = order)

    return send_email (from_contact, to_contact, receipt)

def send_email (from_contact, to_contact, receipt):

    positions = receipt.order.positions.all ()
    links = [create_link (pos.product) for pos in positions]

    ##
    ## TODO: Implement SMTP send mail!
    ##

    return HttpResponse ("*ok*")

def create_link (product):

    source = product.properties.get ('path')
    path_to, file = os.path.split (source)
    link = uuid_random ()
    link_name = os.path.join (path_to, link)
    os.link (source, link_name)

    return "http://notex.ch/download/?uuid=" + link

################################################################################
################################################################################
