from rest_framework.routers import DefaultRouter
from .views import UserViewSet, MoneyViewSet, RecordViewSet

router = DefaultRouter()
router.register("user", UserViewSet)
router.register("money", MoneyViewSet)
router.register("record", RecordViewSet)

urlpatterns = router.urls
