<?php

use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\PapanBunga\PapanBungaController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Models\PapanBunga;
use App\Models\Transaction;
use GuzzleHttp\Client;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
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
    Route::post('/orders/{orderId}/pay', [OrderController::class, 'makePay'])->name('orders.makePay');
    Route::patch('/orders/{orderId}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::get('/webhook/midtrans', [TransactionController::class, 'handle'])->name('transactions.midtrans');
    Route::get('/success', [TransactionController::class, 'success'])->name('transactions.success');
    Route::post('/print/invoice', function (Request $request) {
        $secret = base64_encode(env('MIDTRANS_SERVER_KEY'));
        dd($secret);
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Authorization' => "Basic $secret"
        ])->post("https://api.sandbox.midtrans.com/v1/invoices", $request->all());

        $response = json_decode($response->body());

        dd($response);
    });
});

require __DIR__ . '/auth.php';
