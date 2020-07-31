
from django.urls import path
from .views import calculator, ExposureViewSet
from rest_framework.routers import DefaultRouter



router = DefaultRouter()
router.register(r'exposures', ExposureViewSet)



urlpatterns = [
    path('calculator/<int:pk>/', calculator),
] + router.urls