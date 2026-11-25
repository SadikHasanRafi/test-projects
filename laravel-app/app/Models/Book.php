<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Eloquent model: the class Book maps to the table "books" by convention
class Book extends Model
{
    // Fields that may be filled from request data with Book::create([...])
    protected $fillable = ['title', 'author', 'year'];

    // Default values, so "year" is always in the JSON
    protected $attributes = ['year' => null];

    // This table has no created_at / updated_at columns
    public $timestamps = false;
}
