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

###############################################################################
###############################################################################

CHECKOUT_RECVADDR = '1EfPhEMsUz6qSgtdDDrXPZGP2DgiWQmFX8'
CHECKOUT_NOTIFIER = 'blockchain.info'
CHECKOUT_TESTADDR = '91.203.74.202'

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

    if address != CHECKOUT_RECVADDR:
        content = 'address: %s != %s' % (address, CHECKOUT_RECVADDR)
        logger.error (content); return HttpResponse (content)

    name, aliases, ips = socket.gethostbyname_ex (CHECKOUT_NOTIFIER)
    if not settings.DEBUG and test: ips.append (CHECKOUT_TESTADDR)

    if not settings.DEBUG and name != CHECKOUT_NOTIFIER:
        content = 'name: %s != %s' % (name, CHECKOUT_NOTIFIER)
        logger.error (content); return HttpResponse (content)

    if not settings.DEBUG and not request.META['REMOTE_ADDR'] in ips:
        content = 'REMOTE_ADDR: %s not in %s' % (request.META['REMOTE_ADDR'], ips)
        logger.error (content); return HttpResponse (content)

    ##
    ## Make sure to store the transaction, since after the above checks it is
    #  for *sure* that the bitcoin transaction happened!
    ##

    currency = CURRENCY.objects.get (code = 'BTC')
    to_contact = CONTACT.objects.get (email = 'contact@blackhan.ch')
    from_contact, _ = CONTACT.objects.get_or_create (
        email = email, defaults = {'fullname': fullname})

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

    return send_email_for (order)

def send_email_for (order):

    links = [create_link (pos.product) for pos in order.positions.all ()]

    ##
    ## TODO: Implement SMTP send mail!
    ##

    return HttpResponse ("*ok*")

def create_link (product):

    source = product.path.value
    assert source
    path_to, file = os.path.split (source)
    assert path_to, file

    link = str (uuid_random ())
    link_name = os.path.join (path_to, link)

    ## TODO: os.link (source, link_name)

    return link_name

################################################################################
################################################################################
