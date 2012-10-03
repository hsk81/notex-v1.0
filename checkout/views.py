__author__ = "hsk81"
__date__ = "$Oct 03, 2012 5:48:30 PM$"

################################################################################
################################################################################

from django.conf import settings
from django.http import HttpResponse

import socket
import logging

################################################################################
################################################################################

logger = logging.getLogger (__name__)

################################################################################
################################################################################

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
        content = 'debug: %s, test: %s' % (settings.DEBUG, test)
        logger.error (content)
        return HttpResponse (status=403, content=content)

    if address != settings.CHECKOUT_RECVADDR:
        content = 'address: %s != %s' % (address, settings.CHECKOUT_RECVADDR)
        logger.error (content)
        return HttpResponse (status=403, content=content)

    name, aliases, ips = socket.gethostbyname_ex (settings.CHECKOUT_NOTIFIER)
    if not settings.DEBUG and test: ips.append (settings.CHECKOUT_TESTADDR)

    if not settings.DEBUG and name != settings.CHECKOUT_NOTIFIER:
        content = 'name: %s != %s' % (name, settings.CHECKOUT_NOTIFIER)
        logger.error (content)
        return HttpResponse (status=403, content=content)

    if not settings.DEBUG and not request.META['REMOTE_ADDR'] in ips:
        content = 'REMOTE_ADDR: %s not in %s' % (request.META['REMOTE_ADDR'], ips)
        logger.error (content)
        return HttpResponse (status=403, content=content)

    ##
    ## TODO: Store everything to a database for accounting purposes and *then*
    ##       do further checks and accept/reject payment!
    ##

    if not send_mail:
        logger.warning ('mail: %s' % send_mail)

    if not item_uuid:
        logger.warning ('item: %s' % item_uuid)

    return HttpResponse ("*ok*")

################################################################################
################################################################################
