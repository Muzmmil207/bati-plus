from django.urls import include, path

from .views import commodity, create_csv, home

urlpatterns = [
    path('', home),
    path('commodity/', commodity),
    path('create-csv/', create_csv),
]
