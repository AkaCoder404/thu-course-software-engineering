# Generated by Django 3.1.2 on 2020-10-20 10:00

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_auto_20201020_1737'),
    ]

    operations = [
        migrations.AlterField(
            model_name='asset',
            name='date',
            field=models.DateField(default=datetime.datetime(2020, 10, 20, 18, 0, 42, 980133)),
        ),
        migrations.AlterField(
            model_name='asset',
            name='value_worth',
            field=models.PositiveIntegerField(default=1),
        ),
    ]
