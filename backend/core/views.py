from rest_framework import viewsets
from enterprise.models import Enterprise
from rest_framework.response import Response
from rest_framework import status
from .models import (
    Substance, Supplier, Composition, 
    Component, Mixture
)
from .serializers import (
    SupplierSerializer, SubstanceSerializer,
    CompositionSerializer, ComponentSerializer
)
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

    def create(self, request):
        """
            request contains also data regarding
            containing components

            we save their concentrations as json
            in 'concentrations' field of this model
        """
        composition = super().create(request)
        composition = Composition.objects.get(id=composition.data['id'])

        # now we save all conmponents with their concentrations
        for i in request.data['constituents']:
            component = Component.objects.get(id=i)
            composition.constituents.add(component)

        for i in request.data['additives']:
            component = Component.objects.get(id=i)
            composition.additives.add(component)

        for i in request.data['impurities']:
            component = Component.objects.get(id=i)
            composition.impurities.add(component)

        composition_ser = CompositionSerializer(composition)
        return Response(composition_ser.data, status=status.HTTP_201_CREATED)
    

class ComponentViewSet(EntDataViewSet):
    queryset = Component.objects.all()
    serializer_class = ComponentSerializer