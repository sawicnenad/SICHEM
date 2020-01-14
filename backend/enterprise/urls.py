from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import *



router = DefaultRouter()

router.register(r'enterprises', EnterpriseViewSet)
router.register(r'invitations', InvitationViewSet)

urlpatterns = [
    path('user-sign-up/', user_sign_up),
    path('add-user-to-ent/', add_user_to_ent)
] + router.urls