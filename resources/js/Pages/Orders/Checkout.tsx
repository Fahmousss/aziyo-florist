import MainLayout from '@/Layouts/MainLayout';
import { rupiah } from '@/lib/utils';
import { Order, PageProps } from '@/types';
import { Button } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Checkout({
    auth,
    order,
}: PageProps<{
    order: Order;
}>) {
    const [useNewAddress, setUseNewAddress] = useState(false);
    const { data, setData, patch, processing, errors, reset } = useForm({
        address: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('orders.pay', order.id), {
            onFinish: () => reset('address'),
        });
    };

    return (
        <MainLayout
            auth={auth}
            header={
                <h2 className="text-3xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Checkout
                </h2>
            }
        >
            <Head title="Checkout" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="flex flex-col gap-8 md:flex-row">
                            {/* Order Summary */}
                            <div className="w-full md:w-2/3">
                                <h3 className="mb-4 text-xl font-semibold">
                                    Order Summary
                                </h3>
                                {order.order_products.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 border-b border-gray-200 p-4 dark:border-gray-700"
                                    >
                                        <img
                                            src={
                                                item.papan_bungas?.image
                                                    ? `/storage/${item.papan_bungas.image}`
                                                    : `/storage/logo.png`
                                            }
                                            alt={
                                                item.papan_bungas?.nama ||
                                                'Unavailable'
                                            }
                                            className="h-20 w-20 rounded-md object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {item.papan_bungas?.nama ||
                                                    'Unavailable Item'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-lg text-gray-900 dark:text-white">
                                                {rupiah(item.harga)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4 text-right">
                                    <p className="text-xl font-semibold">
                                        Total:
                                        {rupiah(order.total_harga * 1.1)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Admin Tax(10%) =
                                        {rupiah(order.total_harga * 0.1)}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Form */}
                            <div className="w-full md:w-1/3">
                                <h3 className="mb-4 text-xl font-semibold">
                                    Detail Pembayaran
                                </h3>
                                <form className="space-y-4" onSubmit={submit}>
                                    {/* Address Selection */}
                                    <div className="mb-4">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={useNewAddress}
                                                onChange={(e) =>
                                                    setUseNewAddress(
                                                        e.target.checked,
                                                    )
                                                }
                                                className="rounded border-gray-300 bg-white text-green-500 dark:border-gray-700 dark:bg-gray-900"
                                            />
                                            <span className="text-sm">
                                                Gunakan alamat yang berbeda
                                            </span>
                                        </label>
                                    </div>

                                    {/* Current Address (when not using new address) */}
                                    {!useNewAddress && (
                                        <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                                            <p className="font-medium">
                                                Alamat Sekarang:
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {auth.user.address}
                                            </p>
                                        </div>
                                    )}

                                    {/* New Address Fields */}
                                    {useNewAddress && (
                                        <>
                                            <div>
                                                <label className="mb-1 block text-sm font-medium">
                                                    Alamat
                                                </label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={data.address}
                                                    onChange={(e) =>
                                                        setData(
                                                            'address',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-md border-gray-700 dark:bg-gray-900"
                                                    placeholder="123 Main St"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* Existing Payment Fields */}

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-md bg-green-500 py-2 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                    >
                                        Bayar {rupiah(order.total_harga * 1.1)}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
