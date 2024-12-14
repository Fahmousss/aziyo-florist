<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\PapanBunga;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Midtrans\Snap;

class OrderController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with('orderProducts.papanBungas', 'transactions')
            ->get();

        return Inertia::render('Dashboard', ['orders' => $orders]);
        // dd($orders);
    }

    public function __construct()
    {
        \Midtrans\Config::$serverKey    = config('services.midtrans.serverKey');
        \Midtrans\Config::$isProduction = config('services.midtrans.isProduction');
        \Midtrans\Config::$isSanitized  = config('services.midtrans.isSanitized');
        \Midtrans\Config::$is3ds        = config('services.midtrans.is3ds');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "user_id" => "required|exists:users,id",
            "papanBunga_id" => "required|exists:papan_bungas,id",
            // "harga" => "required"
        ]);

        // dd($validated);

        return DB::transaction(function () use ($request) {
            $pb = PapanBunga::lockForUpdate()->findOrFail($request->papanBunga_id);

            // Find or create pending order for the user
            $order = Order::firstOrCreate(
                [
                    'user_id' => $request->user_id,
                    'status' => 'keranjang'
                ],
                [
                    'total_harga' => 0
                ]
            );

            // Create new order item
            $order->orderProducts()->create([
                'papan_bungas_id' => $pb->id,
                'harga' => $pb->harga
            ]);

            // Update total price
            $order->update([
                'total_harga' => $order->orderProducts->sum(function ($item) {
                    return $item->harga;
                })
            ]);

            return Redirect::back()->with('success', 'Pesanan berhasil ditambahkan');
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return Redirect::back()->with('success', 'Item removed from cart successfully!');
    }

    public function cancel(string $orderId)
    {
        return DB::transaction(function () use ($orderId) {
            $order = Order::with('orderProducts.papanBungas')->findOrFail($orderId);
            // Gate::authorize('update', $order);
            $secret = base64_encode(env('MIDTRANS_SERVER_KEY'));

            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => "Basic $secret"
            ])->post("https://api.sandbox.midtrans.com/v2/$orderId/cancel");

            // $response = json_decode($response->body());
            // dd($response);

            $order->delete();

            return Redirect::back()->with('success');
        });
    }

    public function removeItem(string $orderId, string $orderProductId)
    {
        $orderItem = OrderProduct::findOrFail($orderProductId);
        $order = Order::findOrFail($orderId);
        // Gate::authorize('delete', $order);
        $orderItem->forceDelete();

        if ($order->orderProducts->count() === 0) {
            $order->forceDelete();
        }
        $order->update([
            'total_harga' => $order->orderProducts->sum(function ($item) {
                return $item->harga;
            })
        ]);

        return Redirect::back()->with('success', 'Item removed from cart successfully!');
    }

    public function checkout($orderId)
    {
        return DB::transaction(function () use ($orderId) {
            $order = Order::where('user_id', Auth::id())
                ->where('id', $orderId)
                ->where('status', 'keranjang')
                ->with('orderProducts.papanBungas')
                ->firstOrFail();

            // Check stock availability for all items
            foreach ($order->orderProducts as $item) {
                $papan_bungas = $item->papanBungas;
                if (!$papan_bungas->is_tersedia) {
                    return back()->withErrors(['error' => "Not enough stock available for {$papan_bungas->nama}"]);
                }
            }

            // Decrement stock for all items
            // foreach ($order->orderItems as $item) {
            //     $item->book->decrement('stock', $item->quantity);

            //     // Trigger BookUpdated event for each book
            //     event(new BookUpdated($item->book));
            // }

            // $order->update([
            //     'status' => 'pending',
            // ]);

            return Inertia::render('Orders/Checkout', ['order' => $order]);
            // dd('Oke');

            // return Redirect::route('dashboard')
            //     ->with('success', 'Order completed successfully!');
        });
    }
    public function makePay(Request $request, string $orderId)
    {
        return DB::transaction(function () use ($request, $orderId) {

            $is_existing_null = Transaction::where('transaction_id', 'null')->first();

            if ($is_existing_null) {
                // return Inertia::location($is_existing->payment_url);
                return redirect()->back()->withErrors(['message' => 'Harap selesaikan pembayaran sebelumnya']);
            }

            $request->validate([
                'address' => 'nullable|string',
            ]);

            $user = Auth::user();
            $order = Order::where('user_id', Auth::id())
                ->where('id', $orderId)
                ->where('status', 'keranjang')
                ->with('orderProducts.papanBungas')
                ->firstOrFail();

            // Calculate admin tax (10%)
            function convertToInteger($decimalString)
            {
                $numberWithoutCommas = str_replace(',', '', $decimalString);
                return (int) floatval($numberWithoutCommas);
            }
            $adminTax = $order->total_harga * 0.10;
            $finalTotal = $order->total_harga + $adminTax;

            // Update order with address and final total
            $order->update([
                'status' => 'pending',
                'address' => $request->address ?: $user->address,
                'total_price' => $finalTotal,
            ]);

            $params = [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => convertToInteger($finalTotal),
                ],
                'customer_details' => [
                    'first_name' => $user->name,
                    'email' => $user->email,
                    'shipping_address' => [
                        'address' => $request->address ?: $user->address,
                    ],
                ],
                'item_details' => $order->orderProducts->map(function ($item) {
                    return [
                        'id' => $item->id, // Use product_id or a unique identifier
                        'price' => convertToInteger($item->harga * 1.10), // Price per item
                        'quantity' => 1, // Quantity purchased
                        'name' => $item->papanBungas->nama, // Name of the product
                    ];
                })->toArray(),
                'enabled_payments' => ['echannel', 'gopay', 'shopeepay', 'other_qris']
            ];

            try {
                $secret = base64_encode(env('MIDTRANS_SERVER_KEY'));

                $response = Http::withHeaders([
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                    'Authorization' => "Basic $secret"
                ])->post("https://app.sandbox.midtrans.com/snap/v1/transactions", $params);

                $response = json_decode($response->body());

                // dd($response);

                // Save transaction details
                Transaction::create([
                    'order_id' => $orderId,
                    'transaction_id' => 'null',
                    'payment_status' => 'pending',
                    'payment_url' => $response->redirect_url,
                ]);

                // Auto-redirect to payment URL
                return Inertia::location($response->redirect_url);
            } catch (\Exception $e) {
                return back()->withErrors(['message' => $e->getMessage()]);
            }
        });
    }
}
