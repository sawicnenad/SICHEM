from django.db import models
from enterprise.models import Enterprise

class Substance(models.Model):
    # 1. Substance identification
    enterprise = models.ForeignKey(Enterprise, on_delete=models.CASCADE)
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
    structural_formula = models.ImageField()
    smiles = models.TextField(blank=True)
    origin = models.CharField(max_length=50, blank=True)
    mw = models.DecimalField(
        blank=True,
        null=True,
        max_digits=8,
        decimal_places=2
    )