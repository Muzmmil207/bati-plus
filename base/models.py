from django.db import models


class Commodity(models.Model):
    commodity_name = models.CharField(unique=True, max_length=255)
    commodity_price = models.DecimalField(max_digits=99,decimal_places=2)

    def __str__(self):
        return self.commodity_name
