from rest_framework import serializers
from .models import User, Money, Record


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "family_name",
            "user_name",
            "email_address",
            "password",
            "created_at",
        )
        read_only_fields = ("id", "created_at")
        extra_kwargs = {
            "email_address": {
                "required": True,
                "error_messages": {
                    "required": "メールアドレスは必須です。",
                    "blank": "メールアドレスは必須です。",
                },
            },
            "password": {
                "required": True,
                "error_messages": {
                    "required": "パスワードは必須です。",
                    "blank": "パスワードは必須です。",
                },
            },
        }

    def validate_email_address(self, value):
        if not value:
            raise serializers.ValidationError("メールアドレスは必須です。")
        return value

    def validate_password(self, value):
        if not value:
            raise serializers.ValidationError("パスワードは必須です。")
        return value


class MoneySerializer(serializers.ModelSerializer):
    class Meta:
        model = Money
        fields = ("user_id", "amount", "updated_at")
        read_only_fields = ("user_id", "updated_at")


class RecordSerializer(serializers.ModelSerializer):
    method_display = serializers.CharField(source="get_method_display", read_only=True)

    class Meta:
        model = Record
        fields = (
            "record_id",
            "user_id",
            "date",
            "method",
            "method_display",
            "recorded_money",
            "amount",
            "updated_at",
        )
        read_only_fields = ("id", "amount", "updated_at")
