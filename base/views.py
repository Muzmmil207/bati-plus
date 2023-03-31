import csv
import json
import time
from datetime import date

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods

from .forms import DecimalForm
from .models import Commodity


def home(request):
    try:
        sand, _= Commodity.objects.get_or_create(commodity_name='sand', commodity_price=150)
    except:
        sand = Commodity.objects.get(commodity_name='sand')
    try:
        brick, _= Commodity.objects.get_or_create(commodity_name='brick', commodity_price=0.9)
    except:
        brick = Commodity.objects.get(commodity_name='brick')
    try:
        cement, _= Commodity.objects.get_or_create(commodity_name='cement', commodity_price=80)
    except:
        cement = Commodity.objects.get(commodity_name='cement')
    try:
        water, _= Commodity.objects.get_or_create(commodity_name='water', commodity_price=0.02)
    except:
        water = Commodity.objects.get(commodity_name='water')

    form = DecimalForm()
    context = {'sand':sand,'brick':brick,'cement':cement, 'water':water,'form':form}
    return render(request, "base/home.html", context)


def commodity(request):
    if request.method == "POST":
        data = json.loads(request.body)
        brick = data["brick-length"] * data["brick-height"]
        wall = data["wall-length"] * data["wall-height"]
        response = {}
        response["sand-price"] = round((
            (data["brick-length"] + data["brick-height"])
            * (data["brick-width"] * data["batter-thickness"])
            * data["sand-price"]
        ),2)
        response["sand-amount"] = round((data["brick-length"] + data["brick-height"]) * (
            data["brick-width"] * data["batter-thickness"]
        ),2)
        response["cement-price"] = round((response["sand-price"]) * (250 / 50) * data["cement-price"],2)
        response["cement-amount"] = round((
            (response["sand-price"]) * (250 / 50) * data["cement-price"] / (data["cement-price"])
        ),2)
        response["brick-price"] = round((wall / brick) * data["brick-price"], 2)
        response["brick-amount"] = round(wall / brick,2)
        response["water-price"] = round(response["sand-price"] * data["water-price"] * 1000, 2)
        response["water-amount"] = round(response["sand-price"] * 1000, 2)
        response["total"] = round(sum(
            [
                response["sand-price"],
                response["cement-price"],
                response["brick-price"],
                response["water-price"],
            ]
        ), 3)
        response["id"] = data.get("id")
        time.sleep(0.5)
        return JsonResponse(response, safe=False)
    return JsonResponse({}, safe=False)


# @require_http_methods(["POST"])
def create_csv(request):
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(
        content_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="somefilename.csv"'},
    )
    data = json.loads(request.body)
    column_names = data[1].keys()
    
    writer = csv.writer(response)
    writer.writerow([i.replace('-', ' ').capitalize() for i in column_names])
    for i in data[1:]:
        writer.writerow(i.values())
    writer.writerow(['','','','','','','','',list(data[0].values())[0],'المجموع الكلي'])

    return response
