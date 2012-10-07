__author__ = "hsk81"
__date__ = "$Oct 7, 2012 14:35:00 PM$"

###############################################################################
###############################################################################

from django.test import TestCase
from uuid import uuid4 as uuid_random
from models import *

import os

###############################################################################
###############################################################################

BTC_RECVADDR = os.environ.get('BTC_RECVADDR')
BTC_RECVMAIL = os.environ.get('BTC_RECVMAIL')
BTC_NOTIFIER = os.environ.get('BTC_NOTIFIER')
BTC_NOTIFIER_IP = os.environ.get('BTC_NOTIFIER_IP')

###############################################################################
###############################################################################

class BtcTransactTest (TestCase):

    def transaction_hash (self):

        return uuid_random ().hex + uuid_random ().hex

    def request (self, **args):

        uuid = args.get ('uuid', 'b3bdb98c-6fae-445d-8b64-3c0dbfbf9905')

        try: product = PRODUCT.objects.get (uuid = uuid)
        except: product = None

        return self.client.get ('/erp/btc-transact/', {
            'address': args.get ('address', BTC_RECVADDR),
            'transaction_hash': args.get ('transaction_hash', self.transaction_hash ()),
            'value': args.get ('value', float (product.price.value) * 1E8 if product else 0),
            'confirmations': args.get ('confirmations', 6),
            'anonymous': args.get ('anonymous', False),
            'name': args.get ('name', 'User'),
            'mail': args.get ('mail', 'user@mail.net'),
            'uuid': uuid
        }, **{
            'REMOTE_ADDR': args.get ('REMOTE_ADDR', BTC_NOTIFIER_IP)
        })

    ###########################################################################
    ###########################################################################

    def test_regular (self):

        resp = self.request (confirmations = 0)
        self.assertEqual (resp.content, '*not-ok:anonymous/confirmations*')
        self.assertEqual (resp.status_code, 402)
        resp = self.request (confirmations = 1)
        self.assertEqual (resp.content, '*pending*')
        self.assertEqual (resp.status_code, 200)
        resp = self.request (confirmations = 6)
        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)

    def test_anonymous (self):

        resp = self.request (anonymous = True, confirmations = 0)
        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)
        resp = self.request (anonymous = True, confirmations = 1)
        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)
        resp = self.request (anonymous = True, confirmations = 6)
        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)

    def test_address (self):

        resp = self.request (address = None)
        self.assertEqual (resp.content, '*not-ok:address*')
        self.assertEqual (resp.status_code, 400)

    def test_transaction_hash (self):

        resp = self.request (transaction_hash = '')
        self.assertEqual (resp.content, '*not-ok:transaction-hash*')
        self.assertEqual (resp.status_code, 400)

    def test_value (self):

        resp = self.request (value = 0)
        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)

    def test_mail (self):

        resp = self.request (mail = 'new-user@mail.net', name = 'New User')
        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)

    def test_uuid (self):

        resp = self.request (uuid = None)
        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)

    def test_remote_address (self):

        resp = self.request (REMOTE_ADDR = None)
        self.assertEqual (resp.content, '*not-ok:ip-address*')
        self.assertEqual (resp.status_code, 403)

###############################################################################
###############################################################################
