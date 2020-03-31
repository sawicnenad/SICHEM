from rest_framework import serializers
from .models import (
    Supplier,
    Substance,
    Composition,
    Component,
    Mixture,
    Workplace,
    Worker,
    Use,
    CA
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

class WorkplaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workplace 
        fields = '__all__'

class WorkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Worker
        fields = '__all__'
    
class CASerializer(serializers.ModelSerializer):
    class Meta:
        model = CA
        fields = '__all__'

class UseSerializer(serializers.ModelSerializer):
    cas = CASerializer(many=True)

    class Meta:
        model = Use
        fields = '__all__'

    def create(self, validated_data):
        cas = validated_data.pop('ca_data')
        use = Use.objects.create(**validated_data)

        for ca in cas:
            CA.objects.create(use=use, **ca)

        return use
