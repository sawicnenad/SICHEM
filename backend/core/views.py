from rest_framework import viewsets
from .models import Substance
from .serializers import *
from rest_framework.parsers import MultiPartParser, JSONParser



# EntDataViewSet is the parent for all following viewsets
# that are specific to an enterprise
# Instead of writting for each class get_queryset (for example)
# we define it here in the parent
class EntDataViewSet(viewsets.ModelViewSet):

    def get_queryset(self):
        user = self.request.user.id 
        ent = Enterprise.objects.get(users__id=user)
        ent_specific_queryset = self.queryset.filter(enterprise=ent)
        return ent_specific_queryset

class SupplierViewSet(EntDataViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class SubstanceViewSet(EntDataViewSet):
    queryset = Substance.objects.all()
    serializer_class = SubstanceSerializer
    parser_classes = [MultiPartParser]

class CompositionViewSet(EntDataViewSet):
    queryset = Composition.objects.all()
    serializer_class = CompositionSerializer

class ComponentViewSet(EntDataViewSet):
    queryset = Component.objects.all()
    serializer_class = ComponentSerializer