<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration: a versioned change to the database. Run with `php artisan migrate`
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100);
            $table->string('author', 100);
            $table->unsignedInteger('year')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
