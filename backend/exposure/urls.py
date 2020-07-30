
from django.urls import path
from .views import CalculatorView



urlpatterns = [
    path('calculator/<int:pk>/', CalculatorView.as_view()),
]