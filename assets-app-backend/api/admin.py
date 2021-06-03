from django.contrib import admin
from django.contrib.auth.models import Permission

from . import models

admin.site.register(Permission)
admin.site.site_header = "MAR-Team Backend Admin"
admin.site.site_title = "MAR-Team Backend Admin"

# Register your models here.
admin.site.register(models.AssetStatus)
admin.site.register(models.StaffGroup)
admin.site.register(models.Department)
admin.site.register(models.Staff)
admin.site.register(models.AssetGroup)
admin.site.register(models.Asset)
admin.site.register(models.Auth)
admin.site.register(models.Log)
