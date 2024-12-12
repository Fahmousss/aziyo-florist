<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderProduct extends Model
{

    protected $fillable = [
        'order_id',
        'papan_bungas_id',
        'harga'
    ];
    public function orders()
    {
        return $this->belongsTo(Order::class);
    }

    public function papanBungas()
    {
        return $this->belongsTo(PapanBunga::class);
    }
}
