__author__ = "hsk81"
__date__ = "$Oct 03, 2012 5:48:30 PM$"

################################################################################
################################################################################

from django.conf import settings
from django.http import HttpResponse
from django.core.mail import *

from uuid import uuid4 as uuid_random
from urlparse import urlparse
from models import *

import socket
import smtplib
import os.path
import logging
import subprocess

################################################################################
################################################################################

logger = logging.getLogger (__name__)

################################################################################
################################################################################

BTC_RECVADDR = os.environ.get('BTC_RECVADDR')
BTC_RECVMAIL = os.environ.get('BTC_RECVMAIL')
BTC_NOTIFIER = os.environ.get('BTC_NOTIFIER')
BTC_NOTIFIER_IP = os.environ.get('BTC_NOTIFIER_IP')

################################################################################
################################################################################

def btc_transact (request):

    test = bool (request.GET.get ('test', 'false').lower () != 'false')

    address = request.GET.get ('address', None)
    transaction_hash = request.GET.get ('transaction_hash', None)
    value = float (request.GET.get ('value', '0')) / 1E8 ## 1 Satoshi = 1E8 BTC
    confirmations = int (request.GET.get ('confirmations', '0'))
    anonymous = bool (request.GET.get ('anonymous', 'false').lower () != 'false')

    fullname = request.GET.get ('name', '')
    email = request.GET.get ('mail', None)
    product_uuid = request.GET.get ('uuid', None)

    try: product = PRODUCT.objects.get (uuid = product_uuid)
    except: product = None

    ## Check business rules & apply corresponding actions:

    if settings.DEBUG:
        if not test: return HttpResponse (status=400, content='*not-ok:test*')
    else:
        name, aliases, ips = socket.gethostbyname_ex (BTC_NOTIFIER)
        if name != BTC_NOTIFIER:
            return HttpResponse (status=403, content='*not-ok:notifier*')
        ips.append (BTC_NOTIFIER_IP) ## pre-defined ip address
        if not request.META['REMOTE_ADDR'] in ips:
            return HttpResponse (status=403, content='*not-ok:ip-address*')

    if address != BTC_RECVADDR:
        return HttpResponse (status=400, content='*not-ok:address*')
    if not transaction_hash: ## TODO: Enhanced validation check!
        return HttpResponse (status=400, content='*not-ok:transaction-hash*')

    ## Make sure to store the transaction, since after the above checks, it is
    ## for *sure* that the bitcoin transaction happened:

    currency = CURRENCY.objects.get (code = 'BTC')
    to_contact = CONTACT.objects.get (email = BTC_RECVMAIL)
    from_contact, _ = CONTACT.objects.get_or_create (
        email = email, defaults = {'fullname': fullname})

    try:
        transaction = BTC_TRANSACTION.objects.get (
            transaction_hash = transaction_hash)
    except:
        money = MONEY.objects.create (
            currency = currency, value = value)
        transaction = BTC_TRANSACTION.objects.create (
            transaction_hash = transaction_hash,
            confirmations = confirmations,
            anonymous = anonymous,
            to_contact = to_contact,
            from_contact = from_contact,
            money = money)
    else:
        transaction.confirmations = confirmations
        transaction.save ()

    return process (transaction, product)

def process (transaction, product):

    if not transaction.anonymous and transaction.confirmations == 0:
        return HttpResponse (status=402,
            content='*not-ok:non-anonymous&zero-confirmations*')

    order, created = ORDER.objects.get_or_create (
        from_contact = transaction.from_contact,
        to_contact = transaction.to_contact,
        transaction = transaction)

    if order.processed:
        if not transaction.anonymous and transaction.confirmations < 6:
            return HttpResponse ('*ok:pending-confirmation*', status=402)
        else:
            return HttpResponse ('*ok*')

    if not product:
        ## TODO: Invalid product e-mail!
        order.process (); order.save ()
        return HttpResponse ('*ok*')

    if created:
        price = MONEY.objects.create (
            value = product.price.value, currency = product.price.currency)
        position = ORDER_POSITION.objects.create (
            order = order, product = product, price = price)

    if product.price.currency != transaction.money.currency or \
       product.price.value > transaction.money.value:

        ## TODO: Invalid fund e-mail!
        order.process (); order.save ()
        return HttpResponse (content='*ok*')

    if not send_mail_for (order, product):
        return HttpResponse (status=500)

    order.process (); order.save ()

    if transaction.anonymous or transaction.confirmations >= 6:
        return HttpResponse ('*ok*')

    return HttpResponse ('*ok:pending-confirmation*', status=402)

def send_mail_for (order, product):

    link = create_download_link (product)

    subject = '[%s] Download: %s' % (order.to_contact.email, product.name)
    from_email = order.to_contact.email
    reply_to =  order.to_contact.email
    recipients = [order.from_contact.email]

    message =\
        'Thank you for your purchase! This email contains information ' +\
        'regarding your order and transaction. The provided link is valid ' +\
        'only for the next 3 days and will be removed afterwards.\n'

    message += '\n'
    message += 'Order @ %s\n' % order.timestamp
    message += '\tFrom: %s\n' % order.from_contact
    message += '\tTo: %s\n' % order.to_contact
    message += '\tPositions: %s\n' % ','.join ([
        str (p) for p in ORDER_POSITION.objects.filter (order = order)])
    message += '\tTotal: %s\n' % order.total
    message += '\n'
    message += 'Transaction @ %s\n' % order.transaction.timestamp
    message += '\tFrom: %s\n' % order.transaction.from_contact
    message += '\tTo: %s\n' % order.transaction.to_contact
    message += '\tAmount: %s\n' % order.transaction.money
    message += '\n' 
    message += 'Download Link: %s\n' % link

    email = EmailMessage (subject, message, from_email, recipients, headers = {
        'Reply-To': reply_to
    })

    try:
        email.send ()

    except smtplib.SMTPException as ex:
        logging.exception (ex)
        return False

    return True

def create_download_link (product):

    uuid = str (uuid_random ())

    assert product.link
    upr = urlparse (product.link)
    assert product.path
    path_base, path_file = os.path.split (product.path)

    _, ext = os.path.splitext (path_file)

    assert path_base, upr.path
    path_uuid = os.path.join (path_base, upr.path[1:])
    subprocess.call (['mkdir', '-p', path_uuid])

    assert path_uuid
    path_uuid = os.path.join (path_uuid, uuid)
    os.symlink (product.path, path_uuid + ext)

    return os.path.join (product.link, uuid + ext)

################################################################################
################################################################################
