<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PapanBunga extends Model
{
    use HasFactory;
    protected $fillable = [
        'nama',
        'slug',
        'deskripsi',
        'image',
        'harga',
        'is_tersedia',
    ];

    public function orderProducts()
    {
        return $this->hasMany(OrderProduct::class);
    }

    protected static function booted()
    {
        static::deleting(function ($book) {
            if ($book->image) {
                Storage::disk('public')->delete($book->image);
            }
        });
    }
}
