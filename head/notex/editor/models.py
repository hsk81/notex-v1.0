from django.db.models               import *
from django.contrib.sessions.models import Session

class PROJECT (Model):

    TYPES = (
        ('prj', 'Default Project'),
    )

    sid  = CharField ('Session ID', max_length=32, null=True, default=None)
    name = CharField (max_length=256)
    type = CharField (max_length=3, choices=TYPES, default='prj')
    rank = PositiveIntegerField (default=0)

    def __unicode__ (self):

        return u'%s' % self.name

class FILE (Model):

    TYPES = (
        ('toc', 'Table of Contents'),
        ('sct', 'Section'),
        ('idx', 'Index'),
    )

    project = ForeignKey (PROJECT)
    name    = CharField (max_length=256)
    text    = TextField (blank=True, default='')
    type    = CharField (max_length=3, choices=TYPES, default='sct')
    rank    = PositiveIntegerField (default=0)

    def __unicode__ (self):

        return u'%s' % self.name
