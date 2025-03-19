from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


# Create your models here.
class User(models.Model):
    first_name = models.CharField(max_length=32)
    family_name = models.CharField(max_length=32)
    user_name = models.CharField(max_length=32)
    email_address = models.EmailField(
        max_length=254,
        unique=True,
        null=False,
        blank=False,
        error_messages={
            "unique": "このメールアドレスはすでに使用されています",
            "required": "メールアドレスは必須です。",
        },
    )
    password = models.CharField(
        max_length=128,
        null=False,
        blank=False,
        error_messages={
            "required": "パスワードは必須です。",
        },
    )
    created_at = models.DateTimeField(auto_now_add=True)


class Money(models.Model):
    user_id = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="money", primary_key=True
    )
    amount = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)


@receiver(post_save, sender=User)
def create_user_money(sender, instance, created, **kwargs):
    if created:
        Money.objects.create(user_id=instance)


@receiver(post_save, sender=User)
def save_user_money(sender, instance, **kwargs):
    instance.money.save()


class Record(models.Model):
    record_id = models.AutoField(primary_key=True)
    user_id = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="record",
    )
    date = models.DateField()
    method_choices = (
        ("convenient_store", "コンビニ"),
        ("food", "飲食店"),
        ("supermarket", "スーパー"),
        ("cafe", "カフェ"),
        ("other", "その他"),
    )
    method = models.CharField(
        max_length=16, choices=method_choices, default="convenient_store"
    )
    recorded_money = models.IntegerField(default=0)
    amount = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)
