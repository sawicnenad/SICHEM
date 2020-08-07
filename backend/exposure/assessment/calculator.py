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


    # calculated MF above used to evalueate Score
    # and score is quantified to calculate exposure
    score = E
    gm = math.exp(E + 10.5)
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