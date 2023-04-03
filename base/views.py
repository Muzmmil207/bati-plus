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
        batter = (
            (data["brick-length"] + data["brick-height"])
            * data["brick-width"]
            * data["batter-thickness"]
        ) / 1.1
        response["brick-amount"] = round(wall / brick)
        response["brick-price"] = round(response["brick-amount"] * data["brick-price"], 2)
        response["sand-amount"] = batter * response["brick-amount"]
        response["sand-price"] = round(
            (response["sand-amount"] * data["sand-price"]),
            2,
        )
        response["cement-amount"] = round((response["sand-amount"] / 4.46) / 0.035)
        response["cement-price"] = round(response["cement-amount"] * data["cement-price"], 2)
        response["water-amount"] = round(response["sand-amount"] * 200)
        response["water-price"] = round(response["water-amount"] * data["water-price"], 2)
        response["total"] = sum(
            [
                response["sand-price"],
                response["cement-price"],
                response["brick-price"],
                response["water-price"],
            ]
        )
        response["sand-amount"] = round(response["sand-amount"], 4)
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
        headers={"Content-Disposition": 'attachment; filename="commodity-data.csv"'},
    )
    data = request.session.get("commodity-data")
    if data:
        # column_names = data[1].keys()
        column_names = [
            "Pcs",
            "Brique prix",
            "sable",
            "Prix sable",
            "Pcs Ciment",
            "prix ciment",
            "L ,l'eau",
            "Prix ,l'eau",
            "Total DH",
        ]
        writer = csv.writer(response)
        writer.writerow([i for i in column_names])
        for i in data[1:]:
            writer.writerow(i.values())
        writer.writerow(["Final total", "", "", "", "", "", "", "", list(data[0].values())[0], ""])
        del request.session["commodity-data"]
        return response
    return redirect(home)
