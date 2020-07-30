from django.db import models
from core.models import (
    AssessmentEntity,
    CaOfAEntity,
    WorkerOfAEntity
)




class Exposure(models.Model):
    # Exposure instance is created for every combination of
    # exposure model CA_of_AEntity and Worker 

    # status field may take the following values
    # * incomplete    - meaning that the set of input parameters is not complete
    # * complete      - set of input parameters is complete but no exposure calculated
    # * finished      - as previous but exposure calculation is done

    # missing field contains fields that has no value assigned
    # but they must have it before conducting exposure assessment
    cas_of_aentity = models.ForeignKey(
            CaOfAEntity,
            on_delete=models.CASCADE,
            related_name="exposure"
        )
    exposure_model = models.CharField(max_length=10)
    parameters = models.TextField(default="{}")
    missing = models.TextField(default="[]")
    status = models.CharField(max_length=25)                   
    exposure = models.TextField(default="{}")
    exposure_reg = models.CharField(max_length=50, blank=True)