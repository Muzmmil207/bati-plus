import csv
import json

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods


def home(request):
    return render(request, 'base/home.html')


def commodity(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        data['total'] = sum([ int(i) for i in data.values()])
        return JsonResponse(data, safe=False)
    return JsonResponse({}, safe=False)


@require_http_methods(["POST"])
def create_csv(request):
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(
        content_type='text/csv',
        headers={'Content-Disposition': 'attachment; filename="somefilename.csv"'},
    )
    data = json.loads(request.body)

    writer = csv.writer(response)
    writer.writerow(['First row', 'Foo', 'Bar', 'Baz'])
    writer.writerow(['Second row', 'A', 'B', 'C', '"Testing"', "Here's a quote"])

    return response
