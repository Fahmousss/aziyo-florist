<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class Order extends Model
{
    protected $fillable = [
        'user_id',
        'total_harga',
        'address',
        'status'
    ];


    protected $keyType = 'string';


    public $incrementing = false;




    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // public function papanBunga()
    // {
    //     return $this->belongsToMany(PapanBunga::class, 'order_products');
    // }

    public function orderProducts()
    {
        return $this->hasMany(OrderProduct::class);
    }

    public static function booted()
    {
        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }

    public function transactions()
    {
        return $this->hasOne(Transaction::class);
    }
}
