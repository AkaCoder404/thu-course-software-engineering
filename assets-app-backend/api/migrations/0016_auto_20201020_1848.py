# Generated by Django 3.1.2 on 2020-10-20 10:48

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_auto_20201020_1839'),
    ]

    operations = [
        migrations.AlterField(
            model_name='asset',
            name='date',
            field=models.DateField(verbose_name=datetime.datetime(2020, 10, 20, 18, 48, 7, 400273)),
        ),
    ]