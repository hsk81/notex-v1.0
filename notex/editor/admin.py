__author__="hsk81"
__date__ ="$Mar 27, 2012 1:14:15 PM$"

###############################################################################################
###############################################################################################

from django.contrib.sessions.models import Session
from django.contrib                 import admin
from models                         import *

###############################################################################################
###############################################################################################

class SessionAdmin (admin.ModelAdmin):

    search_fields = ['session_key','expire_date']
    list_display = ('session_key', 'expire_date')
    list_filter = ['expire_date']
    date_hierarchy = 'expire_date'

admin.site.register (Session, SessionAdmin)

class ROOTAdmin (admin.ModelAdmin):

    search_fields = ['usid', 'type', 'rank', 'name']
    list_display = ('usid', 'type', 'rank', 'name')

class ROOT_TYPEAdmin (admin.ModelAdmin):

    search_fields = ['code', 'desc']
    list_display = ('code', 'description', 'icon')

    def description (self, obj):

        return u'%s' % obj.desc

admin.site.register (ROOT, ROOTAdmin)
admin.site.register (ROOT_TYPE, ROOT_TYPEAdmin)

class NODEAdmin (admin.ModelAdmin):

    search_fields = ['name', 'type', 'rank', 'root']
    list_display = ('name', 'type', 'rank', 'root')

class NODE_TYPEAdmin (admin.ModelAdmin):

    search_fields = ['code', 'desc']
    list_display = ('code', 'description', 'icon')

    def description (self, obj):

        return u'%s' % obj.desc

admin.site.register (NODE, NODEAdmin)
admin.site.register (NODE_TYPE, NODE_TYPEAdmin)

class LEAFAdmin (admin.ModelAdmin):

    search_fields = ['name', 'type', 'rank', 'node']
    list_display = ('name', 'type', 'rank', 'node')

class LEAF_TYPEAdmin (admin.ModelAdmin):

    search_fields = ['code', 'desc']
    list_display = ('code', 'description', 'icon')

    def description (self, obj):

        return u'%s' % obj.desc

admin.site.register (LEAF, LEAFAdmin)
admin.site.register (LEAF_TYPE, LEAF_TYPEAdmin)

###############################################################################################
###############################################################################################
