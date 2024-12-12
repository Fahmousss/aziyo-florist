<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    public function orders()
    {
        return $this->belongsTo(Order::class);
    }

    public function papanBungas()
    {
        return $this->belongsTo(papanBunga::class);
    }
}
