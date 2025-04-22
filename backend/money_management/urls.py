from rest_framework.routers import DefaultRouter
from .views import UserViewSet, MoneyViewSet, RecordViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path

router = DefaultRouter()
router.register("user", UserViewSet)
router.register("money", MoneyViewSet)
router.register("record", RecordViewSet)

urlpatterns = [
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
] + router.urls
