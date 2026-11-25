from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def hello(request):
    return Response({"message": "Hello from Django"})


@api_view(["GET", "POST", "PUT", "PATCH", "DELETE"])
def not_found(request):
    return Response({"detail": "Route not found"}, status=404)
