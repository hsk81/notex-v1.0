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

    def transaction_hash (self, last=False):

        if not last:
            self.last_thash = uuid_random ().hex + uuid_random ().hex

        return self.last_thash

    def transaction (self, transaction_hash):

        return BTC_TRANSACTION.objects.get (
            transaction_hash = transaction_hash)

    def order (self, transaction):

        return ORDER.objects.get (
            from_contact = transaction.from_contact,
            to_contact = transaction.to_contact,
            transaction = transaction)

    def assertTransaction (self, transaction, confirmations, anonymous=False):

        self.assertTrue (transaction.anonymous == anonymous)
        self.assertTrue (transaction.confirmations == confirmations)

    def assertOrder (self, order, processed):

        self.assertTrue (order.processed)

    ###########################################################################
    ###########################################################################

    def test_regular (self):

        resp = self.request (confirmations = 0)
        self.assertEqual (resp.content, '*not-ok:non-anonymous&0-confirmations*')
        self.assertEqual (resp.status_code, 200)

        thash = self.transaction_hash (last = True)
        transaction = self.transaction (thash)
        self.assertTransaction (transaction, confirmations=0)

        resp = self.request (confirmations = 1, transaction_hash = thash)
        self.assertEqual (resp.content, '*not-ok:non-anonymous&1-confirmations*')
        self.assertEqual (resp.status_code, 200)

        transaction = self.transaction (thash)
        self.assertTransaction (transaction, confirmations=1)
        order = self.order (transaction)
        self.assertOrder (order, processed = True)

        resp = self.request (confirmations = 2, transaction_hash = thash)
        self.assertEqual (resp.content, '*not-ok:non-anonymous&2-confirmations*')
        self.assertEqual (resp.status_code, 200)

        transaction = self.transaction (thash)
        self.assertTransaction (transaction, confirmations=2)
        order = self.order (transaction)
        self.assertOrder (order, processed = True)

        resp = self.request (confirmations = 6, transaction_hash = thash)
        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)

        transaction = self.transaction (thash)
        self.assertTransaction (transaction, confirmations=6)
        order = self.order (transaction)
        self.assertOrder (order, processed = True)

    def test_anonymous (self):

        resp = self.request (confirmations = 0, anonymous = True)
        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)

        thash = self.transaction_hash (last = True)
        transaction = self.transaction (thash)
        self.assertTransaction (transaction, confirmations=0, anonymous=True)
        order = self.order (transaction)
        self.assertOrder (order, processed = True)

        resp = self.request (confirmations = 1, anonymous = True,
            transaction_hash = thash)
        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)

        transaction = self.transaction (thash)
        self.assertTransaction (transaction, confirmations=1, anonymous=True)
        order = self.order (transaction)
        self.assertOrder (order, processed = True)

        resp = self.request (confirmations = 2, anonymous = True,
            transaction_hash = thash)
        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)

        transaction = self.transaction (thash)
        self.assertTransaction (transaction, confirmations=2, anonymous=True)
        order = self.order (transaction)
        self.assertOrder (order, processed = True)

        resp = self.request (confirmations = 6, anonymous = True,
            transaction_hash = thash)
        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)

        transaction = self.transaction (thash)
        self.assertTransaction (transaction, confirmations=6, anonymous=True)
        order = self.order (transaction)
        self.assertOrder (order, processed = True)

    def test_address (self):

        resp = self.request (address = '')
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

        resp = self.request (mail = 'new-user@mail.net',
            name = 'New User')
        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)

    def test_uuid (self):

        resp = self.request (uuid = '')
        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)

    def test_remote_address (self):

        resp = self.request (REMOTE_ADDR = '')
        self.assertEqual (resp.content, '*not-ok:ip-address*')
        self.assertEqual (resp.status_code, 403)

###############################################################################
###############################################################################
