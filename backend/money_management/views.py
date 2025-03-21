from django.shortcuts import render
from rest_framework import viewsets, mixins
from .models import User, Money, Record
from .serializers import UserSerializer, MoneySerializer, RecordSerializer
from django.db import models, transaction


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):  # CRUD全て可能
    queryset = User.objects.all()
    serializer_class = UserSerializer


class MoneyViewSet(  # Rだけ可能
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    queryset = Money.objects.all()
    serializer_class = MoneySerializer


class RecordViewSet(viewsets.ModelViewSet):  # CRUD全て可能
    queryset = Record.objects.all()
    serializer_class = RecordSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        user = serializer.validated_data["user_id"]
        new_recorded_money = serializer.validated_data["recorded_money"]

        # 現在のユーザーの全レコードの合計を取得
        total_before = (
            Record.objects.filter(user_id=user).aggregate(
                total=models.Sum("recorded_money")
            )["total"]
            or 0
        )

        # 新しい合計を計算（現在の合計 + 新しい記録）
        new_total = total_before + new_recorded_money

        # レコードを保存
        record = serializer.save(amount=new_total)

        # Moneyテーブルも更新
        Money.objects.filter(user_id=user).update(amount=new_total)

        # 最新状態を再取得してレスポンスに反映
        record.refresh_from_db()

    @transaction.atomic
    def perform_update(self, serializer):
        old_recorded_money = serializer.instance.recorded_money
        user = serializer.instance.user_id
        new_recorded_money = serializer.validated_data["recorded_money"]

        # 全体の合計から古い値を引き、新しい値を足す
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

        # レコード更新と Money テーブルも更新
        record = serializer.save(amount=current_total)
        Money.objects.filter(user_id=user).update(amount=current_total)

        # 最新状態を再取得してレスポンスに反映
        record.refresh_from_db()

    def perform_destroy(self, instance):
        user = instance.user_id
        recorded_money = instance.recorded_money

        # 削除後の合計を再計算
        new_total = (
            Record.objects.filter(user_id=user)
            .exclude(record_id=instance.record_id)
            .aggregate(total=models.Sum("recorded_money"))["total"]
            or 0
        )

        # Moneyテーブルを更新
        Money.objects.filter(user_id=user).update(amount=new_total)

        # 削除処理
        instance.delete()
