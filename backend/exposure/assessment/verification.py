
from backend.settings import BASE_DIR
import json, os


# For a model x, checks if all input parameters required
# to run the required exposure assessment are complete

def verify(path_to_json, parameters):
    # this function is mutual for all exposure models
    # as the methodology is the same
    f = open(os.path.join(BASE_DIR, path_to_json))
    json_file = f.read()
    f.close()

    # now parse the json file and verify whether 
    # the established ES if complete by creating
    # an array of inputs for which a value is missing

    # the given JSON file contains two parts:
    # 1. mandatory fields - those that with no condition must be fulfilled
    # 2. conditions - an array of conditions that must be fulfilled for defined conditions
    missing = []
    json_file = json.loads(json_file)

    # verify mandatory
    mandatory = json_file['mandatory']
    for field in mandatory:
        if parameters[field] == False:
            missing.append(field)
    
    # now we itterate condition by condition
    conditions = json_file['conditions']
    for c in conditions:
        # condition c is only evaluated if 'if' statement is True
        do_eval = True

        # first time if condition is not fulfilled - iteration stops
        for if_cond in c['if']:
            is_fulfilled = eval(if_cond)

            if is_fulfilled == False:
                do_eval = False
                break
        
        # this block is executed only if do_eval is true
        # it means that files within c must have a value assigned
        # otherwise the given field is appended
        if do_eval == True:
            for field in c['fields']:
                if parameters[field] in ['', False] or field not in parameters:
                    missing.append(field)

    return missing




def verify_art(parameters):
    # Rules on which input parameters must be entered
    # are defined for each exposure model in a JSON file
    path_to_json = 'data/verifications/art.json'
    missing = verify(path_to_json, parameters)
    return missing


def verify_sm(parameters):
    # Rules on which input parameters must be entered
    # are defined for each exposure model in a JSON file
    path_to_json = 'data/verifications/sm.json'
    missing = verify(path_to_json, parameters)
    return missing

def verify_tra(parameters):
    # Rules on which input parameters must be entered
    # are defined for each exposure model in a JSON file
    path_to_json = 'data/verifications/tra.json'
    missing = verify(path_to_json, parameters)
    return missing