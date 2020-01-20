from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

router.register(r'suppliers', SupplierViewSet)
router.register(r'substances', SubstanceViewSet)

urlpatterns = [] + router.urls