from django.db.models       import *
from django.db.models.query import QuerySet

class BaseModelQuerySet (QuerySet):

    def __getitem__(self, idx):

        result = super (BaseModelQuerySet, self).__getitem__ (idx)
        return isinstance (result, Model) and result.to_type () or result

    def __iter__(self):

        for item in super (BaseModelQuerySet, self).__iter__ ():
            yield item.to_type ()

class BaseModelManager (Manager):

    def get_query_set(self):

        return BaseModelQuerySet (self.model)

class BaseModel (Model):

    objects = BaseModelManager ()
    clsname = CharField (max_length=32, editable=False, null=True)

    def save(self, *args, **kwargs):

        self.clsname = self.__class__.__name__
        self.save_base (*args, **kwargs)

    def to_type (self):

        return eval (self.clsname).objects.get (id=self.id)
