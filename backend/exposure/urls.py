
from django.urls import path
from .views import (
    calculator,  ExposureViewSet, update_exposure
)
from rest_framework.routers import DefaultRouter



router = DefaultRouter()
router.register(r'exposures', ExposureViewSet)



urlpatterns = [
    path('calculator/<int:pk>/', calculator),
    path('update-exposure/<int:pk/', update_exposure)
] + router.urls