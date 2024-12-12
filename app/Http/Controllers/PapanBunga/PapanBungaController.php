<?php

namespace App\Http\Controllers\PapanBunga;

use App\Http\Controllers\Controller;
use App\Models\PapanBunga;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PapanBungaController extends Controller
{
    public function show(string $id)
    {
        $pb = PapanBunga::where('slug', $id)
            ->firstOrFail();

        return Inertia::render('PapanBunga/Show', [
            'papanBunga' => $pb,
        ]);
    }
}
