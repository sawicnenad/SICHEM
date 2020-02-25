from rest_framework.routers import DefaultRouter
from .views import (
    SupplierViewSet,
    SubstanceViewSet,
    CompositionViewSet,
    ComponentViewSet,
    HazardProfileViewSet
)




router = DefaultRouter()

router.register(r'suppliers', SupplierViewSet)
router.register(r'substances', SubstanceViewSet)
router.register(r'compositions', CompositionViewSet)
router.register(r'components', ComponentViewSet)
router.register(r'hazard-profiles', HazardProfileViewSet)

urlpatterns = [] + router.urls