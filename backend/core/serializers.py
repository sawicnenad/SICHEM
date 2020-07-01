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
    WorkerSchedule
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


class AssessmentEntitySerialiizer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentEntity
        fields = '__all__'

class WorkerScheduleSerializer(serializers.ModelSerializer):
    mon1 = serializers.TimeField(format=TIME_FORMAT)
    mon2 = serializers.TimeField(format=TIME_FORMAT)
    mon3 = serializers.TimeField(format=TIME_FORMAT)
    mon4 = serializers.TimeField(format=TIME_FORMAT)
    tue1 = serializers.TimeField(format=TIME_FORMAT)
    tue2 = serializers.TimeField(format=TIME_FORMAT)
    tue3 = serializers.TimeField(format=TIME_FORMAT)
    tue4 = serializers.TimeField(format=TIME_FORMAT)
    wed1 = serializers.TimeField(format=TIME_FORMAT)
    wed2 = serializers.TimeField(format=TIME_FORMAT)
    wed3 = serializers.TimeField(format=TIME_FORMAT)
    wed4 = serializers.TimeField(format=TIME_FORMAT)
    thu1 = serializers.TimeField(format=TIME_FORMAT)
    thu2 = serializers.TimeField(format=TIME_FORMAT)
    thu3 = serializers.TimeField(format=TIME_FORMAT)
    thu4 = serializers.TimeField(format=TIME_FORMAT)
    fri1 = serializers.TimeField(format=TIME_FORMAT)
    fri2 = serializers.TimeField(format=TIME_FORMAT)
    fri3 = serializers.TimeField(format=TIME_FORMAT)
    fri4 = serializers.TimeField(format=TIME_FORMAT)
    sat1 = serializers.TimeField(format=TIME_FORMAT)
    sat2 = serializers.TimeField(format=TIME_FORMAT)
    sat3 = serializers.TimeField(format=TIME_FORMAT)
    sat4 = serializers.TimeField(format=TIME_FORMAT)
    sun1 = serializers.TimeField(format=TIME_FORMAT)
    sun2 = serializers.TimeField(format=TIME_FORMAT)
    sun3 = serializers.TimeField(format=TIME_FORMAT)
    sun4 = serializers.TimeField(format=TIME_FORMAT)

    class Meta:
        model = WorkerSchedule
        fields = '__all__'