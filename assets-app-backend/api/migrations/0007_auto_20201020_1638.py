# Generated by Django 3.1.2 on 2020-10-20 08:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_remove_asset_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='Asset_status',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('unique_id', models.CharField(max_length=100, unique=True)),
                ('display_name', models.CharField(max_length=100)),
            ],
        ),
        migrations.DeleteModel(
            name='AssetStatus',
        ),
    ]
