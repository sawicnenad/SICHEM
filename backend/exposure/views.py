from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (HTTP_200_OK, HTTP_404_NOT_FOUND)
from rest_framework import viewsets
from .assessment.translation import *
from .assessment.verification import *
from .assessment.calculator import *
from .models import Exposure
from core.models import (
    AssessmentEntity,
    CaOfAEntity
)
from core.serializers import AssessmentEntitySerialiazer


# THIS APP EXECUTES THE FOLLOWING TASKS:# 
# * translates "raw" data from core app into input parameters
# * checks if all input parameters require are there
# * calculates exposure using the selected exposure models



@api_view(['GET'])
def calculator(request, pk):
    # Function must first translate raw data into 
    # input parameters of different exposure models
    # using the functions established in translation.py
    # next, it must verify if the list of input parameters
    # is complete for a following exposure assessment
    # using the functions in verification.py
    # this also returns a list of parameters for which no value is given
    # that are later stored in db and forwarded to the front-end side
    # only after all this step the function calculates exposure values
    # using the functions given in calculators.py
    # ----------------------------------------------------------------
    try:
        aentity = AssessmentEntity.objects.get(pk=pk)
    except:
        return Response(status=HTTP_404_NOT_FOUND)
    # all established entities (or ca-s of aentity) for this workplace
    cas = CaOfAEntity.objects.filter(aentity=aentity)
    for ca in cas:
        # art -> translate - verify - calculate
        # here it is importatant to identify the status of Exposure instance (if existing)
        # untested | incomplete | complete | modified | finished
        # untested must follow 1. translation 2. verification and 3. calculation
        # incomplete does not require translation from raw data as this would overwrite the data 
        # obtained from the end-user additional selections in an exposure model
        # complete only requires calculation in order to reach state 'finished'
        # modified must be also verified before the calculation (however it may downgrade to incomplete)
        if ca.art == True:
            try:
                exposure = Exposure.objects.get(cas_of_aentity=ca, exposure_model='art')
                status = exposure.status
                parameters = json.loads(exposure.parameters)
            except:
                status = 'untested'
                exposure = Exposure(cas_of_aentity=ca, exposure_model='art')
            
            # only if untested it is required to run translation from core
            # if raw data is modified then also it is required to run translation
            # this is not done here - elsewhere following modification request
            missing = []
            if status == 'untested':
                parameters = translate_from_core(ca.id)
            if status in ['untested', 'incomplete']:
                missing = verify_art(parameters)
                status = 'incomplete' if len(missing) > 0 else 'complete'
    
            # exposure is calculated only if art_status is complete
            exposure_values = {}
            if ['complete', 'finished'].index(status) > -1:
                exposure_values = art_calculator(parameters)
                status = 'finished'
            
            # store to db
            exposure.parameters = json.dumps(parameters)
            exposure.status = status 
            exposure.exposure_reg = exposure_values['p95'] if 'p95' in exposure_values else ""
            exposure.missing = json.dumps(missing)
            exposure.exposure = json.dumps(exposure_values)
            exposure.save()
    
    # the function returns updated aentity
    data = AssessmentEntity.objects.get(pk=pk)
    data_ser = AssessmentEntitySerialiazer(data)
    return Response(data_ser.data, status=HTTP_200_OK)








class ExposureViewSet(viewsets.ModelViewSet):
    # when end-user opens an exposure situation established
    # by translating from core data - some input parameters
    # may have no value assigned or require update/modification
    # that corresponds better to the actual conditions
    # for this scenario, it is needed to store the updates in db
    # the class is applicable to all three exposure models
    # as they include different pk
    serializer_class = ExposureSerializer
    queryset = Exposure.objects.all()

    def update(self, request, pk):
        exposure = Exposure.objects.get(pk=pk)
        parameters = request.data
        missing = verify_art(parameters)
        status = 'incomplete' if len(missing) > 0 else 'complete'

        # if all parameters are there, we calculate exposure
        exposure_values = {}
        if ['complete', 'finished'].index(status) > -1:
            exposure_values = art_calculator(parameters)
            status = 'finished'

        # stringify, update object and save to db
        exposure.parameters = json.dumps(parameters)
        exposure.missing = json.dumps(missing)
        exposure.status = status
        exposure.exposure = json.dumps(exposure_values)
        exposure.save()

        # serialize and return
        ser_data = ExposureSerializer(exposure)
        return Response(ser_data.data, status=HTTP_200_OK)
        