# Generated by Django 3.1.1 on 2020-10-20 08:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20201020_1605'),
    ]

    operations = [
        migrations.RenameField(
            model_name='asset',
            old_name='value_origin',
            new_name='value',
        ),
    ]