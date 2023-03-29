from django import forms

from .models import Commodity


class DecimalForm(forms.Form):
    price = forms.DecimalField(max_digits=99,decimal_places=2, widget=forms.PasswordInput(
        attrs={'class': 'form-control'}
    ))
