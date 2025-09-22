# type: ignore
from django.shortcuts import render  # type: ignore
from rest_framework import viewsets, mixins, serializers  # type: ignore
from .models import User, Money, Record
from .serializers import (
    UserSerializer,
    MoneySerializer,
    RecordSerializer,
    UserRegistrationSerializer,
)
from django.db import models, transaction  # type: ignore
from rest_framework.permissions import IsAuthenticated, AllowAny  # type: ignore
from rest_framework import status  # type: ignore
from rest_framework.decorators import api_view  # type: ignore
from rest_framework.response import Response  # type: ignore
from rest_framework_simplejwt.views import TokenObtainPairView  # type: ignore
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer  # type: ignore


class CustomTokenObtainPairSerializer(serializers.Serializer):
    email_address = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        # カスタムユーザーモデルで認証
        from django.contrib.auth import get_user_model  # type: ignore

        User = get_user_model()
        email_address = attrs.get("email_address")
        password = attrs.get("password")

        if email_address and password:
            # メールアドレスでユーザーを検索
            try:
                user = User.objects.get(email_address=email_address)
                if user.check_password(password):
                    attrs["user"] = user
                    return attrs
                else:
                    raise serializers.ValidationError("認証情報が正しくありません。")
            except User.DoesNotExist:
                raise serializers.ValidationError("認証情報が正しくありません。")
        else:
            raise serializers.ValidationError(
                "メールアドレスとパスワードを入力してください。"
            )

        return attrs


class CustomTokenObtainPairView(TokenObtainPairView):
    def get_serializer_class(self):
        return CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # JWTトークンを生成
        from rest_framework_simplejwt.tokens import RefreshToken  # type: ignore

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        )


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):  # CRUD全て可能
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == "create":
            return UserRegistrationSerializer
        return UserSerializer


class MoneyViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    permission_classes = [IsAuthenticated]
    queryset = Money.objects.all()
    serializer_class = MoneySerializer

    def get_queryset(self):
        user_id = self.request.query_params.get("user_id")
        queryset = Money.objects.all()

        if user_id:
            queryset = queryset.filter(user_id=user_id)

        return queryset


class RecordViewSet(viewsets.ModelViewSet):  # CRUD全て可能
    permission_classes = [IsAuthenticated]
    queryset = Record.objects.all()
    serializer_class = RecordSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get("user_id")
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")
        sort = self.request.query_params.get("sort")
        order = self.request.query_params.get("order")
        queryset = Record.objects.filter(user_id=self.request.user)

        if (
            user_id and self.request.user.is_staff
        ):  # 管理者のみが他のユーザーのレコードを閲覧可能
            queryset = Record.objects.filter(user_id=user_id)

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        if sort:
            if order == "desc":
                sort = f"-{sort}"
            queryset = queryset.order_by(sort)

        return queryset

    @transaction.atomic
    def perform_create(self, serializer):
        user = serializer.validated_data["user_id"]
        new_recorded_money = serializer.validated_data["recorded_money"]

        total_before = (
            Record.objects.filter(user_id=user).aggregate(
                total=models.Sum("recorded_money")
            )["total"]
            or 0
        )

        new_total = total_before + new_recorded_money

        record = serializer.save(amount=new_total)

        Money.objects.filter(user_id=user).update(amount=new_total)

        record.refresh_from_db()

    @transaction.atomic
    def perform_update(self, serializer):
        old_recorded_money = serializer.instance.recorded_money
        user = serializer.instance.user_id
        new_recorded_money = serializer.validated_data["recorded_money"]

        current_total = (
            (
                Record.objects.filter(user_id=user).aggregate(
                    total=models.Sum("recorded_money")
                )["total"]
                or 0
            )
            - old_recorded_money
            + new_recorded_money
        )

        record = serializer.save(amount=current_total)
        Money.objects.filter(user_id=user).update(amount=current_total)

        record.refresh_from_db()

    def perform_destroy(self, instance):
        user = instance.user_id
        recorded_money = instance.recorded_money

        new_total = (
            Record.objects.filter(user_id=user)
            .exclude(record_id=instance.record_id)
            .aggregate(total=models.Sum("recorded_money"))["total"]
            or 0
        )

        Money.objects.filter(user_id=user).update(amount=new_total)

        instance.delete()
