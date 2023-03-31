import csv
import json
import time
from datetime import date

from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.http import require_http_methods

from .forms import DecimalForm
from .models import Commodity


def home(request):
    context = {}
    return render(request, "base/home.html", context)


def commodity(request):
    if request.method == "POST":
        data = json.loads(request.body)
        brick = data["brick-length"] * data["brick-height"]
        wall = data["wall-length"] * data["wall-height"]
        response = {}
        response["sand-price"] = round(
            (
                (data["brick-length"] + data["brick-height"])
                * (data["brick-width"] * data["batter-thickness"])
                * data["sand-price"]
            ),
            2,
        )
        response["sand-amount"] = round(
            (data["brick-length"] + data["brick-height"])
            * (data["brick-width"] * data["batter-thickness"]),
            2,
        )
        response["cement-price"] = round(
            (response["sand-price"]) * (250 / 50) * data["cement-price"], 2
        )
        response["cement-amount"] = round(
            ((response["sand-price"]) * (250 / 50) * data["cement-price"] / (data["cement-price"])),
            2,
        )
        response["brick-price"] = round((wall / brick) * data["brick-price"], 2)
        response["brick-amount"] = round(wall / brick, 2)
        response["water-price"] = round(response["sand-price"] * data["water-price"] * 1000, 2)
        response["water-amount"] = round(response["sand-price"] * 1000, 2)
        response["total"] = round(
            sum(
                [
                    response["sand-price"],
                    response["cement-price"],
                    response["brick-price"],
                    response["water-price"],
                ]
            ),
            3,
        )
        response["id"] = data.get("id")
        time.sleep(0.5)
        return JsonResponse(response, safe=False)
    return JsonResponse({}, safe=False)


def create_csv(request):
    if request.method == "POST":
        commodity_data = json.loads(request.body)
        request.session["commodity-data"] = commodity_data
        request.session.modified = True
        return render(request, "base/home.html")

    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(
        content_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="somefilename.csv"'},
    )
    data = request.session.get("commodity-data")
    print(data)
    if data:
        column_names = data[1].keys()

        writer = csv.writer(response)
        writer.writerow([i.replace("-", " ").capitalize() for i in column_names])
        for i in data[1:]:
            writer.writerow(i.values())
        writer.writerow(
            ["", "", "", "", "", "", "", "", list(data[0].values())[0], "المجموع الكلي"]
        )
        del request.session["commodity-data"]
        return response
    return redirect(home)
