from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates a default superuser with username "Ponnudurai" and password "Ponnudurai2025".'

    def handle(self, *args, **kwargs):
        username = "Ponnudurai"
        password = "Ponnudurai2025"
        email = "ponnudurai@example.com"

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                role=User.Role.SUPERUSER,  # Set the role to SUPERUSER
                phone_number=None,  # Optional, since phone_number is nullable
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully created superuser: {username}'))
        else:
            self.stdout.write(self.style.WARNING(f'Superuser "{username}" already exists.'))