from rest_framework import serializers
from backend.settings import TIME_FORMAT
from .models import (
    Supplier,
    Substance,
    Composition,
    Component,
    Mixture,
    Workplace,
    Worker,
    Use,
    CA,
    AssessmentEntity,
    WorkerOfAEntity,
    CaOfAEntity,
    ExposureWorkplace
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

    def create(self, validated_data):
        # create assessment entity also
        # each workplace must have an assessment entity (one-to-one relation)
        wp = super().create(validated_data)
        aentity = AssessmentEntity.objects.create(
            workplace=wp, enterprise=wp.enterprise)
        return wp

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


class WorkerOfAEntitySerializer(serializers.ModelSerializer):
    schedule = serializers.JSONField()
    class Meta:
        model = WorkerOfAEntity 
        fields = '__all__'

class CaOfAEntitySerializer(serializers.ModelSerializer):
    schedule = serializers.JSONField()
    class Meta:
        model = CaOfAEntity 
        fields = '__all__'


class AssessmentEntitySerialiazer(serializers.ModelSerializer):

    workers_of_aentity = WorkerOfAEntitySerializer(many=True, required=False)
    cas_of_aentity = CaOfAEntitySerializer(many=True, required=False)

    class Meta:
        model = AssessmentEntity
        fields = '__all__'

    
    def update(self, instance, validated_data):
        worker_data = validated_data.pop('workers_of_aentity')
        ca_data = validated_data.pop('cas_of_aentity')

        # delete previously saved workers_of_aentity
        # delete previously saved cas_of_aentity
        old_workers = WorkerOfAEntity.objects.filter(aentity=instance)
        old_cas = CaOfAEntity.objects.filter(aentity=instance)

        for w in old_workers:
            w.delete()
        for c in old_cas:
            c.delete()

        if len(worker_data) > 0:
            for worker in worker_data:
                WorkerOfAEntity.objects.create(**worker)

        if len(ca_data) > 0:
            for ca in ca_data:
                CaOfAEntity.objects.create(**ca)
    
        # update assessment entity
        return super().update(instance, validated_data)


class ExposureWorkplaceSerializer(serializers.ModelSerializer):
    exposure_models = serializers.JSONField()
    class Meta:
        model = ExposureWorkplace
        fields = '__all__'
