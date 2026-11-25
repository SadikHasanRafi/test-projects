<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

// Form Request: validation rules for the request body (like a zod schema)
class BookRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:100'],
            'author' => ['required', 'string', 'max:100'],
            'year' => ['nullable', 'integer', 'between:0,2100'],
        ];
    }
}
