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
    AssessmentEntityViewSet
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
router.register(r'assessment-entities', AssessmentEntityViewSet)

urlpatterns = [] + router.urls