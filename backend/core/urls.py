from rest_framework.routers import DefaultRouter
from .views import (
    SupplierViewSet,
    SubstanceViewSet,
    CompositionViewSet,
    ComponentViewSet,
    MixtureViewSet,
    WorkplaceViewSet,
    WorkerViewSet,
    UseViewSet,
    AssessmentEntityViewSet,
    ExposureWorkplaceViewSet,
    ExposureEntityViewSet
)




router = DefaultRouter()

router.register(r'suppliers', SupplierViewSet)
router.register(r'substances', SubstanceViewSet)
router.register(r'compositions', CompositionViewSet)
router.register(r'components', ComponentViewSet)
router.register(r'mixtures', MixtureViewSet)
router.register(r'workplaces', WorkplaceViewSet)
router.register(r'workers', WorkerViewSet)
router.register(r'uses', UseViewSet)
router.register(r'a-entities', AssessmentEntityViewSet)
router.register(r'exposure-workplace', ExposureWorkplaceViewSet)
router.register(r'exposure-entities', ExposureEntityViewSet)

urlpatterns = [] + router.urls