from django.urls import include, path

from .views import data, home

urlpatterns = [
    path('', home),
    path('data/', data),
]
