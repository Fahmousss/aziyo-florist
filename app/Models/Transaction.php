<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'order_id',
        'transaction_id',
        'payment_status',
        'payment_type',
        'payment_url'
    ];

    public function orders()
    {
        return $this->belongsTo(Order::class);
    }
}
