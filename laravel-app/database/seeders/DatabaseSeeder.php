<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;

// Sample data. Run with `php artisan db:seed` (or `migrate --seed`)
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Book::create(['title' => 'Clean Code', 'author' => 'Robert C. Martin', 'year' => 2008]);
        Book::create(['title' => 'The Pragmatic Programmer', 'author' => 'Andy Hunt', 'year' => 1999]);
    }
}
