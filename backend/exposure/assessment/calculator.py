from backend.settings import BASE_DIR
import math, os, json








def art_calculator(parameters):

    # some parameters require scores
    # import json file from data/calculations
    path_to_json = os.path.join(BASE_DIR, 'data/calculations/art.json')
    f = open(path_to_json, 'r')
    scores = f.read()
    f.close()
    scores = json.loads(scores)

    form = parameters['physical_form']
    # E: intrinsic property
    # liquid
    

    if form == 'liquid':
        vp = float(parameters['vp'])
        mf = float(parameters['mf'])

        # vapours
        if vp > 10:
            E = vp * mf / 30000
        # mists
        else:
            E = scores['viscosity'][parameters['viscosity']]


    # activity class - subclass - underlying determinants
    d1 = 1
    d2 = 1
    d3 = 1
    d4 = 1

    if 'd1' in parameters:
        if parameters['d1'] != False:
            d1 = scores['d1'][ parameters['d1'] ]
    
    if 'd2' in parameters:
        if parameters['d2'] != False:
            d2 = scores['d2'][ parameters['d2'] ]

    if 'd3' in parameters:
        if parameters['d3'] != False:
            d3 = scores['d3'][ parameters['d3'] ]

    if 'd4' in parameters:
        if parameters['d4'] != False:
            d4 = scores['d4'][ parameters['d4'] ]

    H = d1 * d2 * d3 * d4

    # Local controls
    Lc1 = 1
    Lc2 = 1
    if 'lc1' in parameters:
        if parameters['lc1'] == 'vrs':
            Lc1 = 0.2
        elif parameters['lc1'] != 'no':
            Lc1 = scores['lc'][ parameters['lc1_tech'] ]
        
        # secondary LC
        if parameters['lc1'] != 'no':
            if parameters['lc2'] == 'vrs':
                Lc2 = 0.2
            else:
                Lc2 = scores['lc'][ parameters['lc2_tech'] ]

    Lc = Lc1 * Lc2

    # calculated MF above used to evalueate Score
    # and score is quantified to calculate exposure
    score = E * H * Lc

    
    # set input quantification parameter - alpha
    alpha = 10.56
    if form == 'liquid':
        if vp <= 10:
            apha = 10.23
    
    elif form == 'powder':
        alpha = 3.01
    elif form == 'solid':
        alpha = 0.48
    elif form == 'dissolved':
        apha = 10.23
    elif form == 'paste':
        apha = 3.01


    gm = math.exp(math.log(score) + alpha)
    gm = round(gm)

    exposure = {
        "p50": gm,
        "p75": gm*1.5,
        "p90": gm*2,
        "p95": gm*3,
        "p99": gm*3.8,
        "p50_ci75": [0.05, 0.15],
        "p50_ci80": [0.05, 0.15],
        "p50_ci90": [0.05, 0.15],
        "p50_ci95": [0.05, 0.15],
        "p75_ci75": [0.05, 0.15],
        "p75_ci80": [0.05, 0.15],
        "p75_ci90": [0.05, 0.15],
        "p75_ci95": [0.05, 0.15],
        "p90_ci75": [0.05, 0.15],
        "p90_ci80": [0.05, 0.15],
        "p90_ci90": [0.05, 0.15],
        "p90_ci95": [0.05, 0.15],
        "p95_ci75": [0.05, 0.15],
        "p95_ci80": [0.05, 0.15],
        "p95_ci90": [0.05, 0.15],
        "p95_ci95": [0.05, 0.15],
        "p99_ci75": [0.05, 0.15],
        "p99_ci80": [0.05, 0.15],
        "p99_ci90": [0.05, 0.15],
        "p99_ci95": [0.05, 0.15]
    }
    return exposure