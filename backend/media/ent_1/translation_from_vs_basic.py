import math

# constants
const_teq = math.exp(-0.1)
const_tsk = math.exp(-1/3)
const_sw = const_teq


# input of the maen characteristics of the subjects
# this values are replaced by user's entries
weight = 75
height = 1.8
accl = 1        # 0 if not acclimatized subject
drink = 1
poisture_input = "standing" # other values: sitting and crouching
walk_speed = 0              # walking speed
walk_dir = ''               # walking direction
theta = 0                   # angle between walking direction and wind direction in degrees
#user_met = ''               # -> translate to a value -> met (below)

# computation of derived parameters
adu = 0.202 * weight**0.425 * height**0.725
aux = 3490 * weight/adu

sw_max = 400
if accl == 1: 
    sw_max = 500

w_max = 0.85
if accl == 1:
    w_max = 1

d_max = 50 * weight
if drink == 0:
    d_max = 30 * weight


# input of the primary parameters
duration = 480      # Duration of the work sequence in minutes
t_a = 40            # Air temperature °C
t_g = 40            # Black globe temperature: °C
diam = 15           # Diameter of the black globe, in cm
v_a = 0.3           # Air velocity metres per second
t_r = ((t_g + 273)**4 + 1.1579*10**8 / 0.95 / (diam/100)**0.4 * v_a**0.6 * (t_g-t_a))**0.25 - 273

rh = 35                                                 # Relative humidity
pa = 0.6105*math.exp(17.27*t_a / (t_a+273.3)) * rh/100  # partial water vp kPa
m = 300                                                 # metabolic rate, watts
met = m / adu                                           # metabolic rate, watts per m2 

work = 0                                                # effective mech power watts per m2
icl = 0.5                                               # static thermal insulation clo
imst = 0.38                                             # static moisture permeability index



# effective radiating area of the body
poisture = 1
ardu = 0.77

if poisture_input == 'sitting':
    poisture = 2
    ardu = 0.7
elif poisture_input == 'crouching':
    poisture = 3
    ardu = 0.67

# reflective clothing
ap = 0.54       # Fraction of the body surface covered by the reflective clothing
fr = 0.97       # Emissivity of the reflective clothing (by default: Fr=0.97)


# displacements
def_speed = 0
if walk_speed != 0:
    def_speed = 1

def_dir = 0
if walk_dir != '':
    def_dir = 1


# clothing influence on exchange coefficients
iclst = icl * 0.155
fcl = 1 + 0.3*icl
iast = 0.111
itotst = iclst + iast/fcl

# relative velocities due to air velocity and movements
if def_speed > 0:
    if def_dir == 1:
        var = abs(v_a - walk_speed * math.cos(math.pi * theta/180))
    else:
        if v_a < walk_speed:
            var = walk_speed
        else:
            var = v_a
else:
    walk_speed = 0.0052 * (met-58)
    if walk_speed > 0.7:
        walk_speed = 0.7
    var = v_a


# dynamic clothing insulation
vaux = var
if var > 3:
    vaux = 3

waux = walk_speed
if walk_speed > 1.5:
    waux = 1.5

# clothing insulation correction for wind (var) and walking (walk_speed)
cor_cl = 1.044 * math.exp((0.066*vaux-0.472) * var + (0.117*waux-0.342) * waux)
if corr_cl > 1:
    cor_cl = 1

cor_ia = math.exp((0.047*var-0.472) * var + (0.117*waux-0.342)*waux)
if cor_ia > 1:
    cor_ia = 1

cor_tot = cor_cl
if icl <= 0.6:
    cor_tot = ((0.6-icl) * cor_ia + icl * cor_cl) / 0.6

itotdyn = itotst * cor_tot
iadyn = cor_ia * iast
icldyn = itotdyn - iadyn/fcl


# dynamic evaporation resistance
# correction for wind and walking
cor_e = (2.6*cor_tot-6.5) * cor_tot + 4.9
imdyn = imst * cor_e
if imdyn > 0.9:
    imdyn = 0.9

rtdyn = itotdyn / imdyn / 16.7

# initialisation of the variables of the program
t_re = 36.8
t_cr = 36.8
t_sk = 34.1
t_creq = 36.8
t_sk_t_crwg = 0.3
sw_p = 0
sw_tot = 0
d_limtcr = 999
d_limloss = 999


# iteration of the program
for time in range(1, duration):
    t_re0 = t_re
    t_cr0 = t_cr
    t_sk0 = t_sk
    t_creq0 = t_creq
    t_sk_t_crwg0 = t_sk_t_crwg

    t_creqm = 0.0036*met*36.6
    t_creq = t_creq0 * const_teq + t_creqm * (1- const_teq)     # core temp at this min
    d_storeq = aux/60 * (t_creq - t_creq0) * (1-t_sk_t_crwg0) # heat storage

    # skin temp prediction
    # clothed model
    t_skeqcl = 12.165 + 0.02017 * t_a + 0.04361 * t_r  + 0.19354 * pa - 0.25315 * v_a
    t_skeqcl = t_skeqcl + 0.005346 * met + 0.51274 * t_re

    # nude model
    t_skeqnu = 7.191 + 0.064 * t_a + 0.061 * t_r + 0.198 * pa - 0.348 * v_a
    t_skeqnu = t_skeqnu + 0.616 * t_re

    # value at this minute, as a function of the clothing insulation
    if icl >= 0.6:
        t_skeq = t_skeqcl
    
    elif icl <= 0.2:
        t_skeq = t_skeqnu

    else:
        t_skeq = t_skeqnu + 2.5*(t_skeqcl-t_skeqnu) * (icl-0.2)

    tsk = const_tsk0 * const_tsk + t_skeq * (1 - const_tsk)

    if time = 1:
        t_sk = t_skeq 
    
    p_sk = 0.6105 * math.exp(17.27*tsk/(tsk+237.3))

    # mean temperature of the clothing
    z = 3.5 + 5.2*var
    if var > 1:
        z = 8.7*var**0.6
    
    aux_r = 0.0000000567 * ardu
    fcl_r = (1-ap) * 0.97 + ap * fr
    t_cl = t_r + 0.1

    # dynamic converction coefficient
    h_cdyn = 2.38 * abs(t_cl-t_a)**0.25

    if z > h_cdyn:
        h_cdyn = z

    # radiation coefficient
    hr = fcl_r * aux_r * ((t_cl+273)**4 - (t_r+273)**4) / (t_cl-t_r)
    t_cl1 = ((fcl * (h_cdyn * t_a * hr * t_r) + tsk /icldyn)) / (fcl * (h_cdyn+hr) + 1 / icldyn)
    
    while abs(t_cl-t_cl1) > 0.001:
        t_cl = (t_cl + t_cl1)/2
        h_cdyn = 2.38 * abs(t_cl-t_a)**0.25

        if z > h_cdyn:
            h_cdyn = z

        # radiation coefficient
        hr = fcl_r * aux_r * ((t_cl+273)**4 - (t_r+273)**4) / (t_cl-t_r)
        t_cl1 = ((fcl * (h_cdyn * t_a * hr * t_r) + tsk /icldyn)) / (fcl * (h_cdyn+hr) + 1 / icldyn)
        
    # heat exchanges
    t_exp = 28.56 + 0.115 * t_a + 0.641 * pa
    c_res = 0.001516 * met * (t_exp - t_a)
    e_res = 0.00127 * met * (59.34 + 0.53 * t_a - 11.63 * pa)
    c_onv = fcl * h_cdyn * (t_cl - t_r)
    r_ad = fcl * hr * (t_cl-t_r)
    e_max = (p_sk - pa) / rtdyn
    e_req = met - d_storeq - work - c_res - e_res - c_onv - r_ad        


    # interpretation
    w_req = e_req / e_max
    
    run_swp = False

    if e_req <= 0:
        e_req = 0
        run_swp = True 
    
    elif e_max <= 0:
        e_max = 0
        sw_req = sw_max
        run_swp = True
    
    elif w_req >= 1.7:
        w_req = 1.7
        sw_req = sw_max
        run_swp = True 

    if run_swp == False:
        e_veff = (1-w_req**2/2)
        if w_req > 1:
            e_veff = (2-w_req)**2 / 2

        sw_req = e_req / e_veff
        if sw_req > sw_max:
            sw_req = sw_max
        
    
    # predicted sweat rate, by exponential averaging
    run_storage = False

    if run_swp == True:
        sw_p = sw_p * const_sw + sw_req * (1-const_sw)

        if sw_p <= 0:
            e_p = 0
            sw_p = 0
            run_storage = True

        if run_storage == False:
            # predicted evaporation rate
            k = e_max / sw_p
            wp = 1

            if k >= 0.5:
                wp = math.sqrt(k*k + 2) - k 
            if wp > w_max:
                wp = w_max

            e_p = wp * e_max


    if run_storage == True:
        # heat storage
        d_storage = e_req - e_p + d_storeq
        t_cr1 = t_cr0


    # skin - core weighting
    t_sk_t_crwg = 0.3 -0.09 * (t_cr1 - 36.8)

    if t_sk_t_crwg > 0.3:
        t_sk_t_crwg = 0.3
    
    if t_sk_t_crwg < 0.1:
        t_sk_t_crwg = 0.1

    t_cr = (d_storage / (aux/60)) + t_sk0 * t_sk_t_crwg0 / 2 - t_sk * t_sk_t_crwg / 2
    t_cr = (t_cr + t_cr0 * (1-t_sk_t_crwg0 /2)) / (1- t_sk_t_crwg / 2)
    
    while abs(t_cr-t_cr1) > 0.001:
        t_cr1 = (t_cr1 + t_cr) / 2

        t_sk_t_crwg = 0.3 -0.09 * (t_cr1 - 36.8)

        if t_sk_t_crwg > 0.3:
            t_sk_t_crwg = 0.3
        
        if t_sk_t_crwg < 0.1:
            t_sk_t_crwg = 0.1

        t_cr = (d_storage / (aux/60)) + t_sk0 * t_sk_t_crwg0 / 2 - t_sk * t_sk_t_crwg / 2
        t_cr = (t_cr + t_cr0 * (1-t_sk_t_crwg0 /2)) / (1- t_sk_t_crwg / 2)

    # prediction of the rectal temperature
    t_re = t_re0 + (2*t_cr - 1.962*t_re0 - 1.31) /9


    # total water loss rate after the minute
    sw_tot = sw_tot + sw_p + e_res
    sw_totg = sw_tot * 2.67 * adu/1.8/60

    # computation of the duration limit of exposure dle in min
    if d_limloss == 999 and sw_totg >= d_max:
        d_limloss = time

    # DLE for heat storage
    if d_limtcr == 999 and t_re >= 38:
        d_limtcr = time