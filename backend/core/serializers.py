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
    id = serializers.IntegerField(required=False)

    class Meta:
        model = CA
        fields = '__all__'

class UseSerializer(serializers.ModelSerializer):
    cas = CASerializer(many=True, required=False)

    class Meta:
        model = Use
        fields = '__all__'
    
    def create(self, validated_data):
        use = Use.objects.create(**validated_data)
        return use

    def update(self, instance, validated_data):
        ca_data = validated_data.pop('cas')

        if len(ca_data) > 0:
            for ca in ca_data:
                try:
                    # try to get the instance from db using (if provided) its id
                    # this will update the given instance of CA
                    test = CA.objects.get(id=ca['id'])
                    updated_ca = CA(**ca)
                    updated_ca.id = test.id
                    updated_ca.save()
                except:
                    # if the process above fails
                    # save new instance to the db
                    CA.objects.create(**ca)
    
        # update use
        return super().update(instance, validated_data)
