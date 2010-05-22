from django.contrib.sessions.models import Session
from django.contrib                 import admin
from models                         import *

class PROJECTAdmin (admin.ModelAdmin):

    list_display = ('name', 'type', 'rank', 'sid')
    search_fields = ['name', 'type', 'rank', 'sid']

class FILEAdmin (admin.ModelAdmin):

    list_display = ('name', 'type', 'rank', 'project')
    search_fields = ['name', 'type', 'rank', 'project']

class SessionAdmin (admin.ModelAdmin):

    list_display = ('session_key', 'expire_date')
    list_filter = ['expire_date']
    date_hierarchy = 'expire_date'
    search_fields = ['session_key','expire_date']

admin.site.register (PROJECT, PROJECTAdmin)
admin.site.register (FILE, FILEAdmin)
admin.site.register (Session, SessionAdmin)

