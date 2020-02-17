from django.db import models
from enterprise.models import Enterprise
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class Supplier(models.Model):
    enterprise = models.ForeignKey(Enterprise, on_delete=models.CASCADE)
    origin = models.CharField(max_length=25)
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=255, blank=True)
    info = models.CharField(max_length=255, blank=True)

# for file/img upload
def upload_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'supplier_{}/{}'.format(instance.supplier.id, filename)

class Substance(models.Model):
    # 1. Substance identification
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    reference = models.CharField(max_length=255)
    iupac = models.TextField(blank=True)
    international_names = models.TextField(blank=True)
    other_names = models.TextField(blank=True)
    cas_name = models.CharField(max_length=255, blank=True)
    cas_nr = models.CharField(max_length=25, blank=True)
    ec_name = models.CharField(max_length=255, blank=True)
    ec_nr = models.CharField(max_length=25, blank=True)
    ec_dscr = models.CharField(max_length=255, blank=True)
    index_nr = models.CharField(max_length=25, blank=True)
    eu_registration_nr = models.CharField(max_length=25, blank=True)
    other_identity_codes = models.CharField(max_length=255, blank=True)
    last_update = models.DateField(auto_now=True)

    # 2. Information related to molecular and structural formula
    molecular_formula = models.CharField(max_length=255, blank=True)
    structural_formula = models.ImageField(
        upload_to=upload_path, blank=True, null=True)
    smiles = models.TextField(blank=True)
    origin = models.CharField(max_length=50, blank=True)
    mw = models.CharField(max_length=100, blank=True)
    optical_activity_info = models.CharField(max_length=255, blank=True)
    isomers_info = models.CharField(max_length=255, blank=True)

    # 3. Composition
    substance_type = models.CharField(max_length=50, blank=True)
    purity_degree = models.CharField(max_length=50, blank=True)
    # compositions of this substanced determined by fk in composition table

    # 4. Analytical data + info
    uv_vis = models.FileField(upload_to=upload_path, blank=True, null=True)
    ir = models.FileField(upload_to=upload_path, blank=True, null=True)
    nmr = models.FileField(upload_to=upload_path, blank=True, null=True)
    ms = models.FileField(upload_to=upload_path, blank=True, null=True)
    xrd = models.FileField(upload_to=upload_path, blank=True, null=True)
    xrf = models.FileField(upload_to=upload_path, blank=True, null=True)
    aas = models.FileField(upload_to=upload_path, blank=True, null=True)
    gc = models.FileField(upload_to=upload_path, blank=True, null=True)
    hplc = models.FileField(upload_to=upload_path, blank=True, null=True)
    analytical_methods_info = models.TextField(blank=True)

    # 5. Physical-chemical properties
    physical_state = models.CharField(max_length=50, blank=True)
    bp = models.CharField(max_length=8, blank=True)
    bp_unit = models.CharField(max_length=2, default="°C")
    relative_density = models.CharField(max_length=8, blank=True)
    vp = models.CharField(max_length=8, blank=True)
    vp_at_temp = models.CharField(max_length=50, blank=True)
    vp_at_temp_unit = models.CharField(max_length=2, default="°C")
    solubility = models.CharField(max_length=8, blank=True)
    solubility_at_temp = models.CharField(max_length=50, blank=True)
    solubility_at_temp_unit = models.CharField(max_length=2, default="°C")
    log_kow = models.CharField(max_length=8, blank=True)
    granulometry_sm = models.CharField(max_length=8, blank=True)
    granulometry_md = models.CharField(max_length=8, blank=True)
    granulometry_lg = models.CharField(max_length=8, blank=True)
    dustiness = models.CharField(max_length=25, blank=True)
    dustiness_measured = models.CharField(max_length=8, blank=True)

    # 6. Classification and labelling
    hazard_profile_same = models.BooleanField(default=False)
    # hazard profile for each composition

    # 7. EUH statements
    euh001 = models.BooleanField(default=False)
    euh014 = models.BooleanField(default=False)
    euh018 = models.BooleanField(default=False)
    euh019 = models.BooleanField(default=False)
    euh044 = models.BooleanField(default=False)
    euh029 = models.BooleanField(default=False)
    euh031 = models.BooleanField(default=False)
    euh032 = models.BooleanField(default=False)
    euh066 = models.BooleanField(default=False)
    euh070 = models.BooleanField(default=False)
    euh071 = models.BooleanField(default=False)
    euh201 = models.BooleanField(default=False)
    euh201a = models.BooleanField(default=False)
    euh203 = models.BooleanField(default=False)
    euh204 = models.BooleanField(default=False)
    euh205 = models.BooleanField(default=False)
    euh206 = models.BooleanField(default=False)
    euh207 = models.BooleanField(default=False)
    euh208 = models.BooleanField(default=False)
    euh209 = models.BooleanField(default=False)
    euh210 = models.BooleanField(default=False)
    euh401 = models.BooleanField(default=False)

    # 8. Toxicological values
    reg_dnel_lt_i_sys = models.CharField(max_length=50, blank=True)
    reg_dnel_lt_d_sys = models.CharField(max_length=50, blank=True)
    reg_dnel_lt_o_sys = models.CharField(max_length=50, blank=True)
    reg_dnel_lt_i_loc = models.CharField(max_length=50, blank=True)
    reg_dnel_lt_d_loc = models.CharField(max_length=50, blank=True)
    reg_dnel_lt_o_loc = models.CharField(max_length=50, blank=True)
    reg_dnel_a_i_sys = models.CharField(max_length=50, blank=True)
    reg_dnel_a_d_sys = models.CharField(max_length=50, blank=True)
    reg_dnel_a_o_sys = models.CharField(max_length=50, blank=True)
    reg_dnel_a_i_loc = models.CharField(max_length=50, blank=True)
    reg_dnel_a_d_loc = models.CharField(max_length=50, blank=True)
    reg_dnel_a_o_loc = models.CharField(max_length=50, blank=True)
    reg_dnel_lt_i_sys_unit = models.CharField(max_length=10, blank=True)
    reg_dnel_lt_d_sys_unit = models.CharField(max_length=10, blank=True)
    reg_dnel_lt_o_sys_unit = models.CharField(max_length=10, blank=True)
    reg_dnel_lt_i_loc_unit = models.CharField(max_length=10, blank=True)
    reg_dnel_lt_d_loc_unit = models.CharField(max_length=10, blank=True)
    reg_dnel_lt_o_loc_unit = models.CharField(max_length=10, blank=True)
    reg_dnel_a_i_sys_unit = models.CharField(max_length=10, blank=True)
    reg_dnel_a_d_sys_unit = models.CharField(max_length=10, blank=True)
    reg_dnel_a_o_sys_unit = models.CharField(max_length=10, blank=True)
    reg_dnel_a_i_loc_unit = models.CharField(max_length=10, blank=True)
    reg_dnel_a_d_loc_unit = models.CharField(max_length=10, blank=True)
    reg_dnel_a_o_loc_unit = models.CharField(max_length=10, blank=True)
    ref_dose_response = models.CharField(max_length=8, blank=True)

    ref_dnel_lt_i_sys = models.CharField(max_length=50, blank=True)
    ref_dnel_lt_d_sys = models.CharField(max_length=50, blank=True)
    ref_dnel_lt_o_sys = models.CharField(max_length=50, blank=True)
    ref_dnel_lt_i_loc = models.CharField(max_length=50, blank=True)
    ref_dnel_lt_d_loc = models.CharField(max_length=50, blank=True)
    ref_dnel_lt_o_loc = models.CharField(max_length=50, blank=True)
    ref_dnel_a_i_sys = models.CharField(max_length=50, blank=True)
    ref_dnel_a_d_sys = models.CharField(max_length=50, blank=True)
    ref_dnel_a_o_sys = models.CharField(max_length=50, blank=True)
    ref_dnel_a_i_loc = models.CharField(max_length=50, blank=True)
    ref_dnel_a_d_loc = models.CharField(max_length=50, blank=True)
    ref_dnel_a_o_loc = models.CharField(max_length=50, blank=True)
    ref_dnel_lt_i_sys_unit = models.CharField(max_length=10, blank=True)
    ref_dnel_lt_d_sys_unit = models.CharField(max_length=10, blank=True)
    ref_dnel_lt_o_sys_unit = models.CharField(max_length=10, blank=True)
    ref_dnel_lt_i_loc_unit = models.CharField(max_length=10, blank=True)
    ref_dnel_lt_d_loc_unit = models.CharField(max_length=10, blank=True)
    ref_dnel_lt_o_loc_unit = models.CharField(max_length=10, blank=True)
    ref_dnel_a_i_sys_unit = models.CharField(max_length=10, blank=True)
    ref_dnel_a_d_sys_unit = models.CharField(max_length=10, blank=True)
    ref_dnel_a_o_sys_unit = models.CharField(max_length=10, blank=True)
    ref_dnel_a_i_loc_unit = models.CharField(max_length=10, blank=True)
    ref_dnel_a_d_loc_unit = models.CharField(max_length=10, blank=True)
    ref_dnel_a_o_loc_unit = models.CharField(max_length=10, blank=True)
    ref_dose_response_rac = models.CharField(max_length=8, blank=True)

    # dmel
    dmel_lt_i_sys = models.CharField(max_length=50, blank=True)
    dmel_lt_d_sys = models.CharField(max_length=50, blank=True)
    dmel_lt_o_sys = models.CharField(max_length=50, blank=True)
    dmel_lt_i_loc = models.CharField(max_length=50, blank=True)
    dmel_lt_d_loc = models.CharField(max_length=50, blank=True)
    dmel_lt_o_loc = models.CharField(max_length=50, blank=True)
    dmel_a_i_sys = models.CharField(max_length=50, blank=True)
    dmel_a_d_sys = models.CharField(max_length=50, blank=True)
    dmel_a_o_sys = models.CharField(max_length=50, blank=True)
    dmel_a_i_loc = models.CharField(max_length=50, blank=True)
    dmel_a_d_loc = models.CharField(max_length=50, blank=True)
    dmel_a_o_loc = models.CharField(max_length=50, blank=True)

    dmel_lt_i_sys_unit = models.CharField(max_length=10, blank=True)
    dmel_lt_d_sys_unit = models.CharField(max_length=10, blank=True)
    dmel_lt_o_sys_unit = models.CharField(max_length=10, blank=True)
    dmel_lt_i_loc_unit = models.CharField(max_length=10, blank=True)
    dmel_lt_d_loc_unit = models.CharField(max_length=10, blank=True)
    dmel_lt_o_loc_unit = models.CharField(max_length=10, blank=True)
    dmel_a_i_sys_unit = models.CharField(max_length=10, blank=True)
    dmel_a_d_sys_unit = models.CharField(max_length=10, blank=True)
    dmel_a_o_sys_unit = models.CharField(max_length=10, blank=True)
    dmel_a_i_loc_unit = models.CharField(max_length=10, blank=True)
    dmel_a_d_loc_unit = models.CharField(max_length=10, blank=True)
    dmel_a_o_loc_unit = models.CharField(max_length=10, blank=True)

    # SUVA-MAK values
    suva_mak_wert = models.CharField(max_length=50, blank=True)
    suva_mak_wert_unit = models.CharField(max_length=10, blank=True)
    suva_kzgw = models.CharField(max_length=50, blank=True)
    suva_kzgw_unit = models.CharField(max_length=10, blank=True)
    notation = models.CharField(max_length=2, blank=True)
    critical_toxicity = models.CharField(max_length=255, blank=True)
    tox_file = models.FileField(upload_to=upload_path, blank=True, null=True)

    # Other reference values
    eu_ioelv = models.CharField(max_length=50, blank=True)
    eu_ioelv_unit = models.CharField(max_length=10, blank=True)
    eu_boelv = models.CharField(max_length=50, blank=True)
    eu_boelv_unit = models.CharField(max_length=10, blank=True)
    ge_ags = models.CharField(max_length=50, blank=True)
    ge_ags_unit = models.CharField(max_length=10, blank=True)
    ge_dfg_mak = models.CharField(max_length=50, blank=True)
    ge_dfg_mak_unit = models.CharField(max_length=10, blank=True)
    usa_tlv = models.CharField(max_length=50, blank=True)
    usa_tlv_unit = models.CharField(max_length=10, blank=True)
    usa_niosh = models.CharField(max_length=50, blank=True)
    usa_niosh_unit = models.CharField(max_length=10, blank=True)
    other_tox_name = models.CharField(max_length=50, blank=True)
    other_tox_value = models.CharField(max_length=50, blank=True)
    other_tox_unit = models.CharField(max_length=10, blank=True)
    tox_other_file = models.FileField(
        upload_to=upload_path, blank=True, null=True)

    # 9. Regulatory statuses
    reg_status_ch = models.CharField(max_length=255, blank=True)
    reg_status_ch_other = models.CharField(max_length=255, blank=True)
    reg_status_reach = models.CharField(max_length=255, blank=True)
    reg_status_reach_other = models.CharField(max_length=255, blank=True)
    reg_status_clp = models.CharField(max_length=255, blank=True)
    reg_status_clp_other = models.CharField(max_length=255, blank=True)
    reg_status_eu = models.CharField(max_length=255, blank=True)
    reg_status_eu_other = models.CharField(max_length=255, blank=True)
    reg_status_file = models.FileField(
        upload_to=upload_path, blank=True, null=True)


class Component(models.Model):
    """
        constituents, impurities, additives of composition
    """
    reference = models.CharField(max_length=255)
    cas_name = models.CharField(max_length=255, blank=True)
    cas_nr = models.CharField(max_length=25, blank=True)
    ec_name = models.CharField(max_length=255, blank=True)
    ec_nr = models.CharField(max_length=25, blank=True)
    molecular_formula = models.CharField(max_length=255, blank=True)
    iupac = models.TextField(blank=True)

class Composition(models.Model):
    """
        one substance (above) may have several different compositions
    """
    substance = models.ForeignKey(Substance, on_delete=models.CASCADE)
    constituents = models.ManyToManyField(Component, related_name="constituents")
    impurities = models.ManyToManyField(Component, related_name="impurities")
    additives = models.ManyToManyField(Component, related_name="additives")

class Mixture(models.Model):
    """ Two or more substances mixed """
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    physical_state = models.CharField(max_length=25)        # at 20°C and 101.3 kPa
    dustiness = models.CharField(max_length=50)
    dustiness_measured = models.DecimalField(
        blank=True, null=True, decimal_places=1, max_digits=8)
    pc = models.CharField(max_length=255)                   # product categories - stringified list

class MixtureComponent(models.Model):
    """
        for each substance/component of mixture
        an instance is created containing supplementary data
    """
    substance = models.ForeignKey(
        Substance, null=True, on_delete=models.SET_NULL)
    conc_typical = models.DecimalField(
        blank=True, null=True, decimal_places=4, max_digits=6)
    conc_lower = models.DecimalField(
        blank=True, null=True, decimal_places=4, max_digits=6)
    conc_upper = models.DecimalField(
        blank=True, null=True, decimal_places=4, max_digits=6)
    ac = models.DecimalField(                                       # activity coefficient
        blank=True, null=True, decimal_places=4, max_digits=6)
    info = models.CharField(max_length=255, blank=True)
    function = models.CharField(max_length=255, blank=True)         # technical function - stringified list

class HazardProfile(models.Model):
    """
        every composition/substance (if same for all compositions)/Mixture
        should have a single hazard profile object

        this model uses generic foreign key as compositions, substances and 
        mixtures may be all (one at the time) used as parents of a given instance
    """
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()

    physical = models.TextField(blank=True) # json form -> hazard class: hazard category
    health = models.TextField(blank=True)
    environmental = models.TextField(blank=True)
    additional = models.TextField(blank=True)