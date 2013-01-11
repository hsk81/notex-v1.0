__author__ = 'hsk81'

################################################################################
################################################################################

from django.views.decorators.csrf import csrf_protect
from django.http import HttpResponseRedirect
from django.core.mail import send_mail
from django.conf import settings

import smtplib
import logging

################################################################################
################################################################################

logger = logging.getLogger (__name__)

################################################################################
################################################################################

@csrf_protect
def send_feedback (request):

    if request.method == 'POST':

        name = request.POST['name']
        from_email = request.POST['mail']
        message = request.POST['comment']
        recipients = settings.EMAIL_RECIPIENTS

        try:
            subject = settings.EMAIL_SUBJECT % (name, from_email)
        except:
            subject = settings.EMAIL_SUBJECT

        try:
            send_mail (subject, message, from_email, recipients)

        except smtplib.SMTPException as ex:
            logger.error ({
                'subject': subject,
                'from_email': from_email,
                'message': message,
                'recipients': recipients,
                'exception': ex
            })

    return HttpResponseRedirect ('/editor/contact/')

################################################################################
################################################################################
