# Generated by Django 5.1.5 on 2025-02-05 08:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('goldLoan', '0007_joinscheme_remainingpayments'),
    ]

    operations = [
        migrations.CreateModel(
            name='LivePrice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gold_price', models.FloatField(max_length=8)),
                ('silver_prive', models.FloatField(max_length=8)),
            ],
        ),
    ]
