<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\PapanBunga;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with('orderProducts.papanBungas')
            ->get();

        return Inertia::render('Dashboard', ['orders' => $orders]);
        // dd($orders);
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
        $validated = $request->validate([
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
                    'status' => 'belum_dibayar'
                ],
                [
                    'total_harga' => 0
                ]
            );

            // // Check if this book already exists in order items
            // $existingItem = $order->orderItems()->where('papan_bungas_id', $pb->id)->first();

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

            return Redirect::back()->with('success', 'Book added to cart successfully!');
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
            $order = Order::with('orderProducts.papaBungas')->findOrFail($orderId);
            // Gate::authorize('update', $order);

            $order->update([
                'status' => 'cancelled',
            ]);

            return Redirect::back()->with('success', 'Order cancelled successfully!');
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
                ->where('status', 'belum_dibayar')
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
}
