from rest_framework import serializers
from .models import Exposure


class ExposureSerializer(serializers.ModelSerializer):

    exposure = serializers.JSONField()
    parameters = serializers.JSONField()
    missing = serializers.JSONField()

    class Meta:
        model = Exposure
        fields = '__all__'