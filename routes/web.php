<?php

use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\PapanBunga\PapanBungaController;
use App\Http\Controllers\ProfileController;
use App\Models\PapanBunga;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'isAdmin' => Auth::check() && Auth::user()->roles->pluck('name')->contains(['super_admin', 'admin', 'owner']),
        'papanBunga' => [
            'data' => PapanBunga::orderBy('created_at', 'desc')->get(),
            'current_page' => 1,
            'last_page' => 1,
            'per_page' => 14,
            'total' => PapanBunga::count(),
        ],
    ]);
})->name('home');

Route::get('/papan-bunga/{slug}', [PapanBungaController::class, 'show'])->name('pb.show');
// Route::get('/dashboard', [OrderController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
// Route::get('/dashboards', [OrderController::class, 'index']);


Route::get('/dashboard', [OrderController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/papan-bunga/{slug}', [OrderController::class, 'store'])->name('pb.addToCart');
    Route::get('/orders/{orderId}', [OrderController::class, 'checkout'])->name('orders.checkout');
    Route::delete('/orders/{orderId}', [OrderController::class, 'destroy'])->name('orders.removeOrder');
    Route::delete('/orders/{orderId}/{orderProductId}', [OrderController::class, 'removeItem'])->name('orders.removeItem');
    Route::patch('/orders/{orderId}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
});

require __DIR__ . '/auth.php';
