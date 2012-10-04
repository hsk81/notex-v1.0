__author__ = "hsk81"
__date__ = "$Oct 03, 2012 5:48:30 PM$"

################################################################################
################################################################################

from django.conf import settings
from django.http import HttpResponse
from models import *

from datetime import datetime
from uuid import uuid4 as uuid_random

import socket
import os.path
import logging

################################################################################
################################################################################

logger = logging.getLogger (__name__)

###############################################################################
###############################################################################

BTC_RECVADDR = '1EfPhEMsUz6qSgtdDDrXPZGP2DgiWQmFX8'
BTC_NOTIFIER = 'blockchain.info'
BTC_TESTADDR = '91.203.74.202'

################################################################################
################################################################################

def btc_transact (request):

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

    if address != BTC_RECVADDR:
        content = 'address: %s != %s' % (address, BTC_RECVADDR)
        logger.error (content); return HttpResponse (content)

    name, aliases, ips = socket.gethostbyname_ex (BTC_NOTIFIER)
    if not settings.DEBUG and test: ips.append (BTC_TESTADDR)

    if not settings.DEBUG and name != BTC_NOTIFIER:
        content = 'name: %s != %s' % (name, BTC_NOTIFIER)
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
            money = MONEY.objects.create (currency = currency, value = value))
    else:
        transaction.confirmations = confirmations
        transaction.save ()

    logger.info ('%s: confirmation = %s' % (transaction_hash, confirmations))
    if confirmations == 0: return HttpResponse ("confirmations: 0")

    try: product = PRODUCT.objects.get (uuid = product_uuid)
    except: product = None
    if not product: return HttpResponse ("product: None")

    return process (transaction, product)

def process (transaction, product):

    order, created = ORDER.objects.get_or_create (
        from_contact = transaction.from_contact,
        to_contact = transaction.to_contact,
        transaction = transaction)

    if order.processed:
        return HttpResponse ("order: processed")

    price = MONEY.objects.create (
        value = product.price.value, currency = product.price.currency)
    position = ORDER_POSITION.objects.create (
        order = order, product = product, price = price)

    if not send_email_for (order):
        return HttpResponse ("order: not send_email")

    order.processed_timestamp = datetime.now ()
    order.save ()

    return HttpResponse ("*ok*")


def send_email_for (order):

    links = [create_link (pos.product) for pos in order.positions.all ()]

    ##
    ## TODO: Implement SMTP send mail!
    ##

    return True

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
