from rest_framework import serializers
from .models import *


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class SubstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Substance
        fields = '__all__'