<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function handle(Request $request)
    {
        try {
            $secret = base64_encode(env('MIDTRANS_SERVER_KEY'));

            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => "Basic $secret"
            ])->get("https://api.sandbox.midtrans.com/v2/$request->order_id/status");

            $response = json_decode($response->body());

            // Handle transaction status
            $transactionStatus = $response->transaction_status;
            $orderId = $request->order_id;
            // dd($orderId);

            // Find the corresponding transaction and order
            $transaction = Transaction::where('order_id', $orderId)->first();
            $order = Order::find($orderId);

            // dd($transaction);

            if (!$transaction || !$order) {
                return response()->json(['message' => 'Order or transaction not found'], 404);
            }


            switch ($transactionStatus) {
                case 'capture':
                case 'settlement':
                    // Payment success
                    $transaction->update([
                        'payment_status' => 'paid',
                        'payment_type' => $response->payment_type,
                        'transaction_id' => $response->transaction_id,
                    ]);
                    $order->update(['status' => 'lunas']);
                    $orders = Order::where('id', $request->order_id)
                        ->with('orderProducts.papanBungas', 'transactions')
                        ->get();

                    return Inertia::render('Orders/SuccessOrder', ['orders' => $orders]);
                    break;

                case 'pending':
                    // Payment pending
                    $transaction->update([
                        'payment_status' => 'pending',
                        'payment_type' => $response->payment_type,
                        'transaction_id' => $response->transaction_id,
                    ]);
                    $order->update(['status' => 'pending']);
                    break;

                case 'deny':
                case 'expire':
                case 'cancel':
                    $transaction->update([
                        'payment_status' => 'failed',
                        'payment_type' => $response->payment_type,
                        'transaction_id' => $response->transaction_id,
                    ]);
                    $order->update(['status' => 'dibatalkan']);
                    break;

                default:
                    // Unknown status
                    Log::warning("Unknown transaction status: $transactionStatus");
                    break;
            }

            return redirect(route('dashboard'));
        } catch (\Exception $e) {
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }
    public function success(Request $request)
    {

        $secret = base64_encode(env('MIDTRANS_SERVER_KEY'));

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Authorization' => "Basic $secret"
        ])->get("https://api.sandbox.midtrans.com/v2/$request->order_id/status");

        $response = json_decode($response->body());

        $transaction = Transaction::where('order_id', $request->order_id)->first();

        $orders = Order::find($request->order_id);
        $transaction->update([
            'payment_status' => 'paid',
            'payment_type' => $response->payment_type,
            'transaction_id' => $response->transaction_id,
        ]);
        $orders->update(['status' => 'lunas']);
        $orders = Order::where('id', $request->order_id)
            ->with('orderProducts.papanBungas', 'transactions')
            ->get();

        // dd($orders);
        return Inertia::render('Orders/SuccessOrder', ['orders' => $orders]);
    }
}
