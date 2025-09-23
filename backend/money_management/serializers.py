from rest_framework import serializers
from .models import User, Money, Record


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

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

    def create(self, validated_data):
        user = User.objects.create_user(
            user_name=validated_data["user_name"],
            first_name=validated_data["first_name"],
            family_name=validated_data["family_name"],
            email_address=validated_data["email_address"],
            password=validated_data["password"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user

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
    # 表示用の連番。実データの主キーではない
    display_id = serializers.SerializerMethodField()
    method_display = serializers.CharField(source="get_method_display", read_only=True)

    class Meta:
        model = Record
        fields = (
            "record_id",  # 実PK（models.AutoField primary_key）
            "display_id",  # 表示用の連番
            "user_id",
            "date",
            "method",
            "method_display",
            "recorded_money",
            "amount",
            "updated_at",
        )
        read_only_fields = ("record_id", "display_id", "amount", "updated_at")

    def get_display_id(self, obj):
        return Record.objects.filter(
            user_id=obj.user_id, record_id__lte=obj.record_id
        ).count()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("email_address", "password", "first_name", "family_name", "user_name")

    def create(self, validated_data):
        user = User.objects.create_user(
            email_address=validated_data["email_address"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            family_name=validated_data["family_name"],
            user_name=validated_data["user_name"],
        )
        return user
