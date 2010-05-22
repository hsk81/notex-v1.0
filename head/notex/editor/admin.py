from django.contrib.sessions.models import Session
from django.contrib                 import admin
from models                         import *

class PROJECTAdmin (admin.ModelAdmin):

    list_display = ('name', 'type', 'rank', 'sid')
    search_fields = ['name', 'type', 'rank', 'sid']

class FILEAdmin (admin.ModelAdmin):

    list_display = ('name', 'type', 'rank', 'project')
    search_fields = ['name', 'type', 'rank', 'project']

admin.site.register (Session)
admin.site.register (PROJECT, PROJECTAdmin)
admin.site.register (FILE, FILEAdmin)
