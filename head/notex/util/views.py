import random

class UTIL:

    def create_id (rmin=0, rmax=16**32-1):

        return hex (random.randint (rmin, rmax)).lstrip ('0x').rstrip ('L')

    create_id = staticmethod (create_id)
    