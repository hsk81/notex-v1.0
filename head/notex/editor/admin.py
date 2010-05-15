from django.contrib                 import admin
from models                         import *
from django.contrib.sessions.models import Session

admin.site.register (Session)
admin.site.register (PROJECT)
admin.site.register (FILE)
