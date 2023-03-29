import csv
import json

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods


def home(request):
    return render(request, "base/home.html")


def commodity(request):
    if request.method == "POST":
        data = json.loads(request.body)
        brick = data["brick-length"] * data["brick-height"]
        wall = data["wall-length"] * data["wall-height"]
        response = {}
        response["sand-price"] = (
            (data["brick-length"] + data["brick-height"])
            * (data["brick-width"] * data["batter-thickness"])
            * data["sand-price"]
        )
        response["sand-amount"] = (data["brick-length"] + data["brick-height"]) * (
            data["brick-width"] * data["batter-thickness"]
        )
        response["cement-price"] = (response["sand-price"]) * (250 / 50) * data["cement-price"]
        response["cement-amount"] = (
            (response["sand-price"]) * (250 / 50) * data["cement-price"] / (data["cement-price"])
        )
        response["brick-price"] = (wall / brick) * data["brick-price"]
        response["brick-amount"] = wall / brick
        response["water-price"] = response["sand-price"] * data["water-price"] * 1000
        response["water-amount"] = response["sand-price"] * 1000
        total = sum(
            [
                response["sand-price"],
                response["cement-price"],
                response["brick-price"],
                response["water-price"],
            ]
        )
        response["total"] = float("{:.2f}".format(total))
        response["id"] = data.get("id")
        return JsonResponse(response, safe=False)
    return JsonResponse({}, safe=False)


@require_http_methods(["POST"])
def create_csv(request):
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(
        content_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="somefilename.csv"'},
    )
    data = json.loads(request.body)

    writer = csv.writer(response)
    writer.writerow(["First row", "Foo", "Bar", "Baz"])
    writer.writerow(["Second row", "A", "B", "C", '"Testing"', "Here's a quote"])

    return response
