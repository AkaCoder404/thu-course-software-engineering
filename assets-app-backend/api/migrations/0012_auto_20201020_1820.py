# Generated by Django 3.1.2 on 2020-10-20 10:20

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_auto_20201020_1800'),
    ]

    operations = [
        migrations.AlterField(
            model_name='asset',
            name='date',
            field=models.DateField(default=datetime.datetime(2020, 10, 20, 18, 20, 19, 70602)),
        ),
    ]
