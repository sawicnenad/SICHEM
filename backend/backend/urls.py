
from django.contrib import admin
from django.urls import path, include

# for Files
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)



urlpatterns = [
    path('admin/', admin.site.urls),
    path('exposure/', include('exposure.urls')),
    path('risk/', include('risk.urls')),
    path('', include('core.urls')),
    path('enterprise/', include('enterprise.urls')),
    
    # JWT
    path('token-obtain/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token-refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token-verify/', TokenVerifyView.as_view(), name='token_verify')
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)