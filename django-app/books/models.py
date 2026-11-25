# Model: a Python class = a database table. Django creates the SQL for you.
from django.core.validators import MaxValueValidator
from django.db import models


class Book(models.Model):
    # id is added automatically
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    year = models.PositiveIntegerField(null=True, blank=True, validators=[MaxValueValidator(2100)])

    def __str__(self):
        return self.title
