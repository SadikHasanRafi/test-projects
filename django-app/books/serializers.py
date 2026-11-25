# Serializer: validates incoming JSON and converts models to JSON.
# ModelSerializer reads the rules (max_length, null...) from the model.
from rest_framework import serializers

from books.models import Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "title", "author", "year"]
