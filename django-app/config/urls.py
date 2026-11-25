# Root URL list. Django checks patterns top to bottom.
from django.urls import include, path, re_path

from config import views

urlpatterns = [
    path("", views.hello),
    path("", include("books.urls")),  # add all routes from books/urls.py
    re_path(r"^.*$", views.not_found),  # nothing matched -> 404 (like app.use(notFound))
]
