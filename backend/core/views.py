from rest_framework import viewsets
from .models import Substance
from .serializers import *




class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    
    def get_queryset(self):
        user = self.request.user
        ent = Enterprise.objects.get(users__id=user.id)
        return Supplier.objects.filter(enterprise=ent)

class SubstanceViewSet(viewsets.ModelViewSet):
    queryset = Substance.objects.all()
    serializer_class = SubstanceSerializer

    def get_queryset(self):
        user = self.request.user
        ent = Enterprise.objects.get(users__id=user.id)
        supplier = Supplier.objects.filter(enterprise=ent)
        return Substance.objects.filter(supplier__in=supplier)