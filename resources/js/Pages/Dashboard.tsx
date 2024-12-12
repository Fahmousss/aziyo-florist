import MainLayout from '@/Layouts/MainLayout';
import { formatDate, rupiah } from '@/lib/utils';
import { Order, OrderProduct } from '@/types';
import {
    Button,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Head, router, useForm } from '@inertiajs/react';

export default function Dashboard({
    auth,
    orders,
}: {
    auth: any;
    orders: Order[];
}) {
    const orderStatuses = [
        'belum_dibayar',
        'menunggu_verifikasi',
        'lunas',
        // 'delivered',
        // 'cancelled',
    ];

    const { patch, processing, errors, setError } = useForm({});

    return (
        <MainLayout
            auth={auth}
            header={
                <h2 className="text-3xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Keranjang Anda
                </h2>
            }
        >
            <Head title="Keranjang Anda" />
            <div className="py-12">
                <TabGroup>
                    <TabList className="flex flex-wrap gap-4 md:flex-row">
                        {orderStatuses.map((status) => (
                            <Tab
                                key={status}
                                className="text-md rounded-lg px-3 py-1 font-semibold capitalize text-gray-800 hover:bg-gray-200 focus:outline-none data-[hover]:bg-gray-100 data-[selected]:bg-gray-200 data-[selected]:data-[hover]:bg-gray-200 data-[focus]:outline-1 data-[focus]:outline-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:outline-white dark:data-[hover]:bg-gray-700 dark:data-[selected]:bg-gray-800 dark:data-[selected]:data-[hover]:bg-gray-800 dark:data-[focus]:outline-white"
                            >
                                {status}
                            </Tab>
                        ))}
                    </TabList>
                    <TabPanels className="mt-4">
                        {orderStatuses.map((status) => (
                            <TabPanel
                                key={status}
                                className="rounded-lg bg-white p-3 text-gray-800 shadow-md dark:bg-gray-800 dark:text-white"
                            >
                                {orders.filter(
                                    (order: Order) => order.status === status,
                                ).length > 0 ? (
                                    orders
                                        .filter(
                                            (order: Order) =>
                                                order.status === status,
                                        )
                                        .map((order: Order) => (
                                            <div
                                                key={order.id}
                                                className="mb-9"
                                            >
                                                <div className="flex justify-between">
                                                    <h3 className="text-lg font-semibold">
                                                        Order {order.id}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Status:{' '}
                                                        <span
                                                            className={`font-semibold uppercase ${
                                                                order.status ===
                                                                'cancelled'
                                                                    ? 'text-red-500'
                                                                    : order.status ===
                                                                            'delivered' ||
                                                                        order.status ===
                                                                            'shipped'
                                                                      ? 'text-green-500'
                                                                      : 'text-yellow-500'
                                                            }`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </p>
                                                </div>

                                                {order.order_products.length >
                                                0 ? (
                                                    order.order_products.map(
                                                        (
                                                            item: OrderProduct,
                                                        ) => (
                                                            <div key={item.id}>
                                                                <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 p-4 dark:border-gray-700 sm:flex-row sm:items-center">
                                                                    <div className="flex items-start gap-4">
                                                                        <img
                                                                            src={
                                                                                item
                                                                                    .papan_bungas
                                                                                    ?.image
                                                                                    ? `/storage/${item.papan_bungas.image}`
                                                                                    : `/storage/logo.png`
                                                                            }
                                                                            alt={
                                                                                item
                                                                                    .papan_bungas
                                                                                    ?.nama ||
                                                                                'Unavailable'
                                                                            }
                                                                            className="h-20 w-20 rounded-md object-cover"
                                                                        />
                                                                        <div className="flex flex-col gap-1">
                                                                            <p className="text-lg font-semibold">
                                                                                {item
                                                                                    .papan_bungas
                                                                                    ?.nama ||
                                                                                    'Unavailable Book'}
                                                                            </p>
                                                                            {status ===
                                                                                'cart' && (
                                                                                <p className="text-sm text-red-500">
                                                                                    {!item
                                                                                        .papan_bungas
                                                                                        ?.is_tersedia
                                                                                        ? 'This item is no longer available'
                                                                                        : ''}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-4">
                                                                        <p>
                                                                            {status ===
                                                                            'belum_dibayar'
                                                                                ? rupiah(
                                                                                      item.harga,
                                                                                  )
                                                                                : `Total Price: ${rupiah(
                                                                                      item.harga,
                                                                                  )}`}
                                                                        </p>
                                                                        {status ===
                                                                            'belum_dibayar' && (
                                                                            <div className="flex items-center gap-4">
                                                                                <Button
                                                                                    className="rounded-md px-3 py-1 text-red-600 hover:text-red-700"
                                                                                    onClick={() => {
                                                                                        router.delete(
                                                                                            route(
                                                                                                'orders.removeItem',
                                                                                                {
                                                                                                    orderId:
                                                                                                        order.id,
                                                                                                    orderProductId:
                                                                                                        item.id,
                                                                                                },
                                                                                            ),
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <TrashIcon className="h-6 w-6" />
                                                                                </Button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )
                                                ) : (
                                                    <p>No items in order</p>
                                                )}

                                                <div className="mt-4 flex flex-col justify-between gap-2 md:flex-row">
                                                    <div className="space-y-2">
                                                        <p className="text-sm text-gray-500">
                                                            Created at:{' '}
                                                            {formatDate(
                                                                order.created_at,
                                                            )}
                                                        </p>
                                                        {status === 'lunas' &&
                                                            order.address && (
                                                                <div className="text-sm">
                                                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                                                        Shipping
                                                                        to:{' '}
                                                                    </span>
                                                                    <span className="text-gray-600 dark:text-gray-400">
                                                                        {
                                                                            order.address
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                        {order.total_harga &&
                                                            status !==
                                                                'belum_dibayar' && (
                                                                <div className="space-y-1">
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        Subtotal:
                                                                        $
                                                                        {order.order_products.reduce(
                                                                            (
                                                                                acc,
                                                                                item,
                                                                            ) =>
                                                                                acc +
                                                                                item.harga,
                                                                            0,
                                                                        )}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        Admin
                                                                        Tax: 10%
                                                                    </p>
                                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                        Total:
                                                                        {rupiah(
                                                                            order.total_harga,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            )}
                                                    </div>
                                                    <div>
                                                        {status ===
                                                        'belum_dibayar' ? (
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    className="inline-flex items-center gap-2 rounded-md px-3 py-1 text-red-600 hover:text-red-700"
                                                                    onClick={() => {
                                                                        router.delete(
                                                                            route(
                                                                                'orders.removeOrder',
                                                                                order.id,
                                                                            ),
                                                                        );
                                                                    }}
                                                                >
                                                                    <TrashIcon className="h-6 w-6" />
                                                                    Remove Order
                                                                </Button>
                                                                {order.order_products.every(
                                                                    (
                                                                        item: OrderProduct,
                                                                    ) =>
                                                                        item.papan_bungas &&
                                                                        item
                                                                            .papan_bungas
                                                                            .is_tersedia,
                                                                ) ? (
                                                                    <Button
                                                                        className="rounded-md bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                                                                        disabled={
                                                                            processing
                                                                        }
                                                                        onClick={() => {
                                                                            router.get(
                                                                                route(
                                                                                    'orders.checkout',
                                                                                    order.id,
                                                                                ),
                                                                            );
                                                                        }}
                                                                    >
                                                                        Checkout
                                                                    </Button>
                                                                ) : null}
                                                            </div>
                                                        ) : status !==
                                                              'delivered' &&
                                                          status !==
                                                              'cancelled' ? (
                                                            <Button
                                                                className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                                                                onClick={() => {
                                                                    router.patch(
                                                                        route(
                                                                            'orders.cancel',
                                                                            order.id,
                                                                        ),
                                                                    );
                                                                }}
                                                            >
                                                                Cancel Order
                                                            </Button>
                                                        ) : status ===
                                                          'delivered' ? (
                                                            <Button className="rounded-md bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">
                                                                Review
                                                            </Button>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="py-8 text-center">
                                        <p className="text-xl font-semibold text-gray-400">
                                            {status === 'belum_dibayar'
                                                ? 'Your cart is empty'
                                                : status ===
                                                    'menunggu_verifikasi'
                                                  ? 'No pending orders'
                                                  : status === 'lunas'
                                                    ? 'No shipped orders'
                                                    : 'No cancelled orders'}
                                        </p>
                                        {status === 'belum_dibayar' && (
                                            <Button
                                                className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                                                onClick={() =>
                                                    router.visit(route('home'))
                                                }
                                            >
                                                Browse Books Now
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </TabPanel>
                        ))}
                    </TabPanels>
                </TabGroup>
            </div>
        </MainLayout>
    );
}
