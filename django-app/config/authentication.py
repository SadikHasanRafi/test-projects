# DRF splits auth in two:
#   authentication = WHO is calling (this file)
#   permission     = are they ALLOWED (IsAuthenticatedOrReadOnly in settings.py)
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


class ApiClient:
    """Stands in for a logged-in user."""

    is_authenticated = True


class BearerTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        header = request.headers.get("Authorization")
        if not header:
            return None  # anonymous: can only read (GET)
        if header != f"Bearer {settings.API_TOKEN}":
            raise AuthenticationFailed("Invalid token")
        return (ApiClient(), None)  # (user, token)

    def authenticate_header(self, request):
        return "Bearer"  # tells DRF to answer 401 (not 403) when not logged in
