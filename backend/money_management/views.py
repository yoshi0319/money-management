from django.shortcuts import render
from rest_framework import viewsets, mixins
from .models import User, Money, Record
from .serializers import (
    UserSerializer,
    MoneySerializer,
    RecordSerializer,
    UserRegistrationSerializer,
)
from django.db import models, transaction
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


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
        queryset = Record.objects.filter(user_id=self.request.user)

        if (
            user_id and self.request.user.is_staff
        ):  # 管理者のみが他のユーザーのレコードを閲覧可能
            queryset = Record.objects.filter(user_id=user_id)

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

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
