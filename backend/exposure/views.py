from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from .assessment.translation import translate_from_core




"""
    THIS APP EXECUTES THE FOLLOWING TASKS:

    * translates "raw" data from core app into input parameters
    * checks if all input parameters require are there
    * calculates exposure using the selected exposure models
"""
@api_view(['POST'])
def calculator(request):
    translate_from_core(87, 39)
    return Response("OK", status=status.HTTP_200_OK)