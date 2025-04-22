from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser, BaseUserManager


# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, email_address, password=None, **extra_fields):
        if not email_address:
            raise ValueError("メールアドレスは必須です")
        user = self.model(email_address=email_address, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email_address, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email_address, password, **extra_fields)


class User(AbstractUser):
    username = None
    USERNAME_FIELD = "email_address"
    REQUIRED_FIELDS = ["user_name"]
    objects = CustomUserManager()
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
    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="record",
    )
    date = models.DateField()
    method_choices = (
        ("convenience_store", "コンビニ"),
        ("food", "飲食店"),
        ("supermarket", "スーパー"),
        ("cafe", "カフェ"),
        ("other", "その他"),
    )
    method = models.CharField(
        max_length=17, choices=method_choices, default="convenience_store"
    )
    recorded_money = models.IntegerField(default=0)
    amount = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # 合計を自動計算
        total = (
            Record.objects.filter(user_id=self.user_id)
            .exclude(record_id=self.record_id)
            .aggregate(total=models.Sum("recorded_money"))["total"]
            or 0
        )
        self.amount = total + self.recorded_money

        # Moneyテーブルも更新
        Money.objects.filter(user_id=self.user_id).update(amount=self.amount)

        super().save(*args, **kwargs)
