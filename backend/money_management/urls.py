from rest_framework.routers import DefaultRouter
from .views import UserViewSet, MoneyViewSet, RecordViewSet
from django.urls import path

router = DefaultRouter()
router.register("user", UserViewSet)
router.register("money", MoneyViewSet)
router.register("record", RecordViewSet)

urlpatterns = router.urls
