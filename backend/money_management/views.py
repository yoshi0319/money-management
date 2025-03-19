from django.shortcuts import render
from rest_framework import viewsets, mixins
from .models import User, Money, Record
from .serializers import UserSerializer, MoneySerializer, RecordSerializer


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class MoneyViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    queryset = Money.objects.all()
    serializer_class = MoneySerializer


class RecordViewSet(viewsets.ModelViewSet):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
