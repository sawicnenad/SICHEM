from core.models import *
from core.serializers import *
from backend.settings import BASE_DIR
import json, os


def translate_from_json(path_to_json, data_for_trans):
    # translates data_for_trans 
    # by applying the translation rules stored in 
    # the corresponding .json file for which we
    # provide path in argument 'path_to_json'
    # --------------------------------------------
    f = open(os.path.join(BASE_DIR, path_to_json))
    json_file = f.read()
    f.close()
    rules = json.loads(json_file)
    # --------------------------------------------


    # after we have rules we need to execute a translation
    # operation for each key in the established translation rules
    # as sometimes translation failes to find appropriate 
    # outcomes, we need to use try-except to prevent errors
    # the translation outcomes are stored in object 'result'
    # --------------------------------------------
    result = {}

    for key in rules:
        # different translation types (!) are possible
        # sometimes it is simple one to one (i.e.) translation
        # in some cases, however, additional operations are required
        try:
            rule = rules[key]
            trans_type = rules[key]['type']
            from_value = data_for_trans[rule['from']]

            if trans_type == 'default':
                result[key] = rule['result'][from_value]

            elif trans_type == 'copy':
                result[key] = from_value

            else:
                rules[key] = False

        
        # translation failed
        except:
            result[key] = False

            
    # --------------------------------------------
    return result

def join_data(*args):
    # Simply joines all values in objects (args)
    # into a single object that is returned
    total_data = {}

    for arg in args:
        for key in arg.data:
            total_data[key] = arg.data[key]

    return total_data


def translate_from_core(entity, substance=None): 
  
    # Translates raw data from core models 
    # into input parameters corresponding
    # to ART exposure model always because
    # later these parameters can easily be 
    # translated into Stoffenmanager or TRA# 
    # args:
    # * entity    - instance of ca_of_aentity
    # * worker    - instance of worker_of_aentity

    # obtain original instances that include required data
    entity = CaOfAEntity.objects.get(pk=entity)
    wp = entity.aentity.workplace
    
    # if mixture then args contain substance id
    if substance is not None:
        substance = Substance.objects.get(pk=substance)
    else:
        substance = entity.substance

    # serialize data
    # in order to join them into a single data object later
    substance_ser = SubstanceSerializer(substance)
    ca_ser = CASerializer(entity.ca)
    wp_ser = WorkplaceSerializer(wp)

    # data is an object containing all starting data for translation
    data = join_data(substance_ser, ca_ser, wp_ser)

    # parameter translation
    # applies function 'translate_from_json'
    # we need to provide path to json file and the starting data
    # which is 'data' variable in which we joined all data (e.g. 
    # substance, contributin activities, workplace ...)
    path = 'data/translations/data_to_art.json'
    parameters = translate_from_json(path, data)

    return parameters