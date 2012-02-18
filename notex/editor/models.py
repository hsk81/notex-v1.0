from django.core.exceptions         import FieldError
from django.db.models               import *

class BASE_TYPE (Model):

    _code = CharField (max_length=32, unique=True)
    _icon = CharField (max_length=256, blank=True, default='')
    _desc = CharField (max_length=256)
    
    code = property (
        lambda s: getattr (s, '_code'), lambda s, v: setattr (s, '_code', v)
    )

    icon = property (
        lambda s: getattr (s, '_icon'), lambda s, v: setattr (s, '_icon', v)
    )

    desc = property (
        lambda s: getattr (s, '_desc'), lambda s, v: setattr (s, '_desc', v)
    )

    def __unicode__ (self):

        return u'%s' % self.code
        
class BASE (Model):

    _name = CharField (max_length=256, blank=True, default='')
    _rank = IntegerField (default=0)
    _type = ForeignKey (BASE_TYPE)

    name = property (
        lambda s: getattr (s, '_name'), lambda s, v: setattr (s, '_name', v)
    )

    rank = property (
        lambda s: getattr (s, '_rank'), lambda s, v: setattr (s, '_rank', v)
    )

    def set_type (self, value):

        if isinstance (value, eval ('%s_TYPE' % self.__class__.__name__)):
            setattr (self, '_type', value)
        else:
            raise FieldError ('invalid type: %s' % value.__class__.__name__)

    type = property (
        lambda s: getattr (s, '_type'), set_type
    )

    def to_type (self):

        return eval (self.clsname).objects.get (id=self.id)
        
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

class NODE_TYPE (BASE_TYPE):

    class Meta:

        verbose_name = 'Node Type'

class NODE (BASE):

    _root = ForeignKey (ROOT)
    _node = ForeignKey ('NODE', null=True, default=None)

    root = property (
        lambda s: getattr (s, '_root'), lambda s, v: setattr (s, '_root', v)
    )

    node = property (
        lambda s: getattr (s, '_node'), lambda s, v: setattr (s, '_node', v)
    )

class LEAF_TYPE (BASE_TYPE):

    class Meta:

        verbose_name = 'Leaf Type'

class LEAF (BASE):

    _node = ForeignKey (NODE)
    _text = TextField (blank=True, default='')
    
    node = property (
        lambda s: getattr (s, '_node'), lambda s, v: setattr (s, '_node', v)
    )

    text = property (
        lambda s: getattr (s, '_text'), lambda s, v: setattr (s, '_text', v)
    )
