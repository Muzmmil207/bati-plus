import json
from time import sleep

from django.http import JsonResponse
from django.shortcuts import render


def home(request):
    return render(request, 'base/home.html')

def data(request):
    sleep(1)
    if request.method == 'POST':
        data = json.loads(request.body)
        data['total'] = sum([ int(i) for i in data.values()])
        return JsonResponse(data, safe=False)
    return JsonResponse({}, safe=False)
