__author__ = "hsk81"
__date__ = "$Mar 27, 2012 1:12:57 PM$"

################################################################################
################################################################################

from django.conf import settings
from django.shortcuts import redirect
from django.http import HttpResponse

import socket

################################################################################
################################################################################

def page_not_found (request):

    return redirect ('/editor/')

def checkout (request):

    test = bool (request.GET.get ('test', 'false').lower () != 'false')
    address = request.GET.get ('address', None)
    confirmations = int (request.GET.get ('confirmations', '0'))
    value = int (request.GET.get ('value', '0')) ## 1 Satoshi is 1E8 BTC
    transaction_hash = request.GET.get ('transaction_hash', None)
    anonymous = bool (request.GET.get ('anonymous', 'false').lower () != 'false')

    send_mail = request.GET.get ('mail', None)
    item_uuid = request.GET.get ('item', None)

    if settings.DEBUG and test:
        return HttpResponse (status=403,
            content='debug: %s, test: %s' % (settings.DEBUG, test))

    if address != settings.CHECKOUT_RECVADDR:
        return HttpResponse (status=403,
            content='address: %s != %s' % (address, settings.CHECKOUT_RECVADDR))

    name, aliases, ips = socket.gethostbyname_ex (settings.CHECKOUT_NOTIFIER)
    if not settings.DEBUG and name != settings.CHECKOUT_NOTIFIER:
        return HttpResponse (status=403,
            content='name: %s != %s' % (name, settings.CHECKOUT_NOTIFIER))

    if not settings.DEBUG and not request.META['REMOTE_ADDR'] in ips:
        return HttpResponse (status=403,
            content='REMOTE_ADDR: %s not in %s' % (request.META['REMOTE_ADDR'], ips))

    ##
    ## TODO: Store everything to a database for accounting purposes and *then*
    ##       do further checks and accept/reject payment!
    ##

    if not send_mail:
        return HttpResponse (status=403, content='mail: %s' % send_mail)
    if not item_uuid:
        return HttpResponse (status=403, content='item: %s' % item_uuid)

    return HttpResponse ("*ok*")

################################################################################
################################################################################
