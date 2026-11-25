<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookRequest;
use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    // GET /books?author=martin
    public function index(Request $request)
    {
        $query = Book::query();

        if ($request->filled('author')) {
            $query->where('author', 'like', '%'.$request->query('author').'%');
        }

        return $query->get(); // models and collections become JSON automatically
    }

    // GET /books/{book}
    // Route model binding: Laravel loads the Book by id, or sends 404 if missing
    public function show(Book $book)
    {
        return $book;
    }

    // POST /books
    // BookRequest validates the body before this method runs (422 if invalid)
    public function store(BookRequest $request)
    {
        $book = Book::create($request->validated());

        return response()->json($book, 201);
    }

    // PUT /books/{book}
    public function update(BookRequest $request, Book $book)
    {
        $book->update($request->validated());

        return $book;
    }

    // DELETE /books/{book}
    public function destroy(Book $book)
    {
        $book->delete();

        return response()->noContent(); // 204
    }
}
