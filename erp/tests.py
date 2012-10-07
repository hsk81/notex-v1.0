__author__ = "hsk81"
__date__ = "$Oct 7, 2012 14:35:00 PM$"

################################################################################
################################################################################

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

################################################################################
################################################################################

class ErpTest (TestCase):

    def setUp (self):
        pass

    def tearDown (self):
        pass

    ###########################################################################
    ###########################################################################

    def transaction_hash (self):

        return uuid_random ().hex + uuid_random ().hex

    ###########################################################################
    ###########################################################################

    def test_regular (self):

        product = PRODUCT.objects.get (
            uuid = 'b3bdb98c-6fae-445d-8b64-3c0dbfbf9905'
        )

        resp = self.client.get ('/erp/btc-transact/', {
            'address': BTC_RECVADDR,
            'transaction_hash': self.transaction_hash (),
            'value': float (product.price.value) * 1E8, ## Satoshi
            'confirmations': 6,
            'anonymous': False,
            'name': 'User',
            'mail': 'user@test.net',
            'uuid': product.uuid
        }, **{
            'REMOTE_ADDR': BTC_NOTIFIER_IP
        })

        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)

    def test_anonymous (self):

        product = PRODUCT.objects.get (
            uuid = 'b3bdb98c-6fae-445d-8b64-3c0dbfbf9905'
        )

        resp = self.client.get ('/erp/btc-transact/', {
            'address': BTC_RECVADDR,
            'transaction_hash': self.transaction_hash (),
            'value': float (product.price.value) * 1E8, ## Satoshi
            'confirmations': 6,
            'anonymous': True,
            'name': 'User',
            'mail': 'user@test.net',
            'uuid': product.uuid
        }, **{
            'REMOTE_ADDR': BTC_NOTIFIER_IP
        })

        self.assertEqual (resp.content, '*ok*')
        self.assertEqual (resp.status_code, 200)

    def test_address (self):

        resp = self.client.get ('/erp/btc-transact/',
            {'address=':''}, **{'REMOTE_ADDR': BTC_NOTIFIER_IP})
        self.assertEqual (resp.status_code, 400)

################################################################################
################################################################################
