from rest_framework import serializers
from .models import (
    Supplier,
    Substance,
    Composition,
    Component,
    Mixture
)


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class SubstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Substance
        fields = '__all__'

class CompositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Composition
        fields = '__all__'

class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = '__all__'

class MixtureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mixture 
        fields = '__all__'