from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .assessment.translation import *
from .assessment.verification import *
from .assessment.calculator import *
from .models import Exposure
from core.models import (
    AssessmentEntity,
    CaOfAEntity
)


# THIS APP EXECUTES THE FOLLOWING TASKS:# 
# * translates "raw" data from core app into input parameters
# * checks if all input parameters require are there
# * calculates exposure using the selected exposure models



class CalculatorView(APIView):
    def post(self, request, pk):
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
            return Response(status=status.HTTP_404_NOT_FOUND)

        # all established entities (or ca-s of aentity) for this workplace
        cas = CaOfAEntity.objects.filter(aentity=aentity)

        for ca in cas:
            # art -> translate - verify - calculate
            if ca.art == True:
                art_parameters = translate_from_core(ca.id, 39)
                art_missing = verify_art(art_parameters)
                art_status = 'incomplete' if len(art_missing) > 0 else 'complete'
        
                # exposure is calculated only if art_status is complete
                art_exposure = ''
                if art_status == 'complete':
                    art_exposure = art_calculator(art_parameters)
                    art_status = 'finished'
                
                # store to db
                Exposure.objects.create(
                    cas_of_aentity = ca,
                    exposure_model = 'art',
                    parameters = json.dumps(art_parameters),
                    status = status,
                    exposure = json.dumps(art_exposure),
                    exposure_reg = '',
                    missing = json.dumps(art_missing)
                )
        

        return Response("OK", status=status.HTTP_200_OK)

    