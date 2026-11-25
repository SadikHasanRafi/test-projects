# Views = controllers. One function handles several HTTP methods of one URL.
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from books.models import Book
from books.serializers import BookSerializer


def get_book_or_404(pk):
    try:
        return Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        raise NotFound("Book not found")  # DRF turns this into a 404 response


# GET /books?author=martin, POST /books
@api_view(["GET", "POST"])
def book_list(request):
    if request.method == "GET":
        books = Book.objects.all()
        author = request.query_params.get("author")
        if author:
            books = books.filter(author__icontains=author)  # WHERE author LIKE '%...%'
        return Response(BookSerializer(books, many=True).data)

    serializer = BookSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)  # invalid -> 400 with the errors
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# GET, PUT, DELETE /books/5
@api_view(["GET", "PUT", "DELETE"])
def book_detail(request, pk):
    book = get_book_or_404(pk)

    if request.method == "GET":
        return Response(BookSerializer(book).data)

    if request.method == "PUT":
        serializer = BookSerializer(book, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    book.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
