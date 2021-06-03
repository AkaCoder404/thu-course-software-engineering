import datetime

from django.db import models

# Create your models here.
from django.template.backends import django

from math import ceil

class StaffGroup(models.Model):
    unique_id = models.CharField(unique=True, max_length=100)
    display_name = models.CharField(max_length=100)

    def __str__(self):
        return self.display_name


class Department(models.Model):
    unique_id = models.CharField(unique=True, max_length=100)
    display_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    parent = models.ForeignKey("self", on_delete=models.PROTECT, null=True, blank=True)

    def __str__(self):
        return self.display_name


class Staff(models.Model):
    unique_id = models.CharField(unique=True, max_length=100)
    group = models.ForeignKey(StaffGroup, on_delete=models.PROTECT)
    department = models.ForeignKey(Department, on_delete=models.PROTECT)
    display_name = models.CharField(unique=True, max_length=100)
    username = models.CharField(unique=True, max_length=100)
    password = models.CharField(max_length=100)
    locked = models.BooleanField(default=False)

    def __str__(self):
        return self.display_name

def get_default_asset_group():
    return AssetGroup.objects.get(unique_id="0")

class AssetGroup(models.Model):
    unique_id = models.CharField(unique=True, max_length=100)
    display_name = models.CharField(unique=True, max_length=100)
    parent = models.ForeignKey("self", on_delete=models.SET(get_default_asset_group), blank=True, null=True)

    def __str__(self):
        return self.display_name


class AssetStatus(models.Model):
    unique_id = models.CharField(unique=True, max_length=100)
    display_name = models.CharField(max_length=100)

    def __str__(self):
        return self.display_name



class Asset(models.Model):
    unique_id = models.CharField(unique=True, max_length=100)
    group = models.ForeignKey(AssetGroup, on_delete=models.SET(get_default_asset_group), blank=True, null=True)
    under = models.ForeignKey("self", on_delete=models.SET_NULL, blank=True, null=True)
    display_name = models.CharField(max_length=100)
    belongs_to = models.ForeignKey(Staff, on_delete=models.SET_NULL, blank=True, null=True, related_name="belongs_to")
    belongs_department = models.ForeignKey(Department, on_delete=models.SET_NULL, blank=True, null=True)
    belongs_to_pending = models.ForeignKey(Staff, on_delete=models.SET_NULL, blank=True, null=True)
    applicant = models.ForeignKey(Staff, on_delete=models.SET_NULL, blank=True, null=True, related_name="applicant")
    date = models.DateField()
    use_year = models.PositiveIntegerField(default=5)
    value_origin = models.PositiveIntegerField(default=1)
    value_worth = models.PositiveIntegerField(default=1)
    status = models.ForeignKey(AssetStatus, on_delete=models.SET_NULL, blank=True, null=True)
    brand = models.CharField(max_length=100, default="unknown")
    model = models.CharField(max_length=100, default="unknown")
    serial_number = models.CharField(max_length=100, default="unknown")
    remarks = models.CharField(max_length=100, default="无")

    def __str__(self):
        return self.display_name

    def value_now(self):
        years=(datetime.date.today()-self.date).days/365
        if years>self.use_year:
            return 0
        else:
            return int(ceil(self.value_origin*(1-years/self.use_year)))



class Auth(models.Model):
    token = models.CharField(unique=True, max_length=100)
    user = models.ForeignKey(Staff, on_delete=models.CASCADE)
    authtime = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.token


class Log(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    related_user = models.ForeignKey(Staff, on_delete=models.CASCADE)
    type = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    datetime = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.description

