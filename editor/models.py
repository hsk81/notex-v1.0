__author__ = "hsk81"
__date__ = "$Mar 27, 2012 1:13:38 PM$"

################################################################################
################################################################################

from django.db.models.signals import pre_delete
from django.core.exceptions import FieldError
from django.dispatch import receiver
from django.conf import settings
from django.db.models import *

import subprocess
import os.path
import os

################################################################################
################################################################################

class BASE_TYPE (Model):

    _code = CharField (max_length=32, unique=True)
    _icon = CharField (max_length=256, blank=True, default='')
    _desc = CharField (max_length=256)

    code = property (
        lambda s: getattr (s, '_code'), lambda s, v: setattr (s, '_code', v))
    icon = property (
        lambda s: getattr (s, '_icon'), lambda s, v: setattr (s, '_icon', v))
    desc = property (
        lambda s: getattr (s, '_desc'), lambda s, v: setattr (s, '_desc', v))

    def __unicode__ (self):

        return u'%s' % self.code

class BASE (Model):

    _name = CharField (max_length=256, blank=True, default='')
    _rank = IntegerField (default=0)
    _type = ForeignKey (BASE_TYPE)

    def set_type (self, value):

        if isinstance (value, eval ('%s_TYPE' % self.__class__.__name__)):
            setattr (self, '_type', value)
        else:
            raise FieldError ('invalid type: %s' % value.__class__.__name__)

    name = property (
        lambda s: getattr (s, '_name'), lambda s, v: setattr (s, '_name', v))
    rank = property (
        lambda s: getattr (s, '_rank'), lambda s, v: setattr (s, '_rank', v))
    type = property (
        lambda s: getattr (s, '_type'), set_type)

    def __unicode__ (self):

        return u'%s' % self.name

class ROOT_TYPE (BASE_TYPE):

    class Meta:
        verbose_name = 'Root Type'

class ROOT (BASE):

    _usid = CharField (max_length=32, null=True, default=None)

    usid = property (
        lambda s: getattr (s, '_usid'), lambda s, v: setattr (s, '_usid', v)
    )

@receiver(pre_delete, sender=ROOT)
def on_delete_root (sender, **kwargs):

    root = kwargs['instance']

    if not hasattr (root, 'delete_data') or root.delete_data:
        path_to = os.path.join (settings.MEDIA_DATA, root.usid)
        if os.path.exists (path_to): subprocess.check_call (['rm', path_to, '-r'])

    if not hasattr (root, 'delete_temp') or root.delete_temp:
        path_to = os.path.join (settings.MEDIA_TEMP, root.usid)
        if os.path.exists (path_to): subprocess.check_call (['rm', path_to, '-r'])

    if not hasattr (root, 'delete_usid') or root.delete_usid:
        path_to = os.path.join (settings.SESSION_FILE_PATH, settings.SESSION_COOKIE_NAME + root.usid)
        if os.path.exists (path_to): subprocess.check_call (['rm', path_to, '-f'])

class NODE_TYPE (BASE_TYPE):

    class Meta:
        verbose_name = 'Node Type'

class NODE (BASE):

    _root = ForeignKey (ROOT)
    _node = ForeignKey ('NODE', null=True, default=None)

    root = property (
        lambda s: getattr (s, '_root'), lambda s, v: setattr (s, '_root', v))
    node = property (
        lambda s: getattr (s, '_node'), lambda s, v: setattr (s, '_node', v))

class LEAF_TYPE (BASE_TYPE):

    class Meta:
        verbose_name = 'Leaf Type'

class LEAF (BASE):

    _node = ForeignKey (NODE)
    _file = CharField (max_length=256)

    node = property (
        lambda s: getattr (s, '_node'), lambda s, v: setattr (s, '_node', v))
    file = property (
        lambda s: getattr (s, '_file'), lambda s, v: setattr (s, '_file', v))

@receiver(pre_delete, sender=LEAF)
def on_delete_leaf (sender, **kwargs):

    leaf = kwargs['instance']
    path_to = os.path.join (settings.MEDIA_DATA, leaf.file)
    if os.path.exists (path_to): os.remove (path_to)

################################################################################
################################################################################
