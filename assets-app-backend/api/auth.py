import time
import random
import string
from . import models

def login(username, password):
    if models.Staff.objects.filter(username=username, password=password).exists():
        random_id = random_str()
        new_auth = models.Auth(token=random_id, user=models.Staff.objects.filter(username=username, password=password).first())
        new_auth.save()
        return new_auth.token
    else:
        return None

def random_str():
    return str(int(time.time())) + ''.join(random.choice(string.ascii_letters) for i in range(8))

def logout(token):
    if models.Auth.objects.filter(token=token).exists():
        user = models.Auth.objects.filter(token=token).first().user
        models.Auth.objects.filter(token=token).delete()
        return user
    else:
        return None


def get_user_from_token(token):
    if models.Auth.objects.filter(token=token).exists():
        return models.Auth.objects.filter(token=token).first().user
    else:
        return None

def is_system_admin(staff_object):
    if staff_object.group.unique_id == "systemadmin":
        return True
    else:
        return False

def is_asset_admin(staff_object):
    if staff_object.group.unique_id == "assetadmin":
        return True
    else:
        return False

def is_general_staff(staff_object):
    if staff_object.group.unique_id == "generalstaff":
        return True
    else:
        return False