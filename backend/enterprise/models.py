from django.db import models
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string

class Enterprise(models.Model):
    """
        Enterprise may have many users
        and is starting point of SICHEM

        Its instance is the foreign key to
        workplaces, workers, substances ...
    """
    name = models.CharField(max_length=100)
    admin = models.ForeignKey(
        User,                                       # user who authorised to allow others to manage data
        on_delete=models.CASCADE,
        related_name="admin"
        )
    users = models.ManyToManyField(                 # users who have the access to the enterprise data
        User,
        related_name="users"
        )
    uid = models.CharField(max_length=15, verbose_name="UID")
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=25)
    branch = models.IntegerField()                  # branch id

    def __str__(self):
        return '{} (UID: {})'.format(self.name, self.uid)


class Invitation(models.Model):
    """
        Creates invitation tokens for new users
        who will be authorised to manage enterprise data
    """
    enterprise = models.ForeignKey(Enterprise, on_delete=models.CASCADE)
    token = models.CharField(max_length=32)
    email = models.EmailField()

    def set_token(self):
        self.token = get_random_string(length=32)