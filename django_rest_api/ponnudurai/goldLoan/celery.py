# your_project/celery.py
import os
from celery import Celery
from celery.schedules import crontab
from datetime import timedelta

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ponnudurai.settings')

app = Celery('ponnudurai')

# Load task modules from all registered Django apps
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in all installed apps
app.autodiscover_tasks()

# Schedule the task to run daily at 3:14 PM
app.conf.beat_schedule = {
    'update-live-prices-daily': {
        'task': 'goldLoan.tasks.update_live_prices',
        #'schedule': timedelta(seconds=10),
        'schedule': crontab(hour=15, minute=14),  # 3:14 PM
    },
}