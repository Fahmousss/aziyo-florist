import MainLayout from '@/Layouts/MainLayout';
import { formatDate, rupiah } from '@/lib/utils';
import { PageProps, PapanBunga } from '@/types';
import { Transition } from '@headlessui/react';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Show({
    auth,
    papanBunga,
}: PageProps<{ papanBunga: PapanBunga }>) {
    // const [quantity] = useState(1);
    const [papanBungas, setPapanBungas] = useState<PapanBunga[]>([papanBunga]);
    // const {
    //     data,
    //     setData,
    //     get,
    //     clearErrors,
    //     errors,
    //     setError,
    //     processing,
    //     recentlySuccessful,
    // } = useForm({
    //     user_id: auth.user?.id,
    //     papanBunga_id: papanBunga.id,
    //     harga: papanBunga.harga,
    // });

    const {
        data,
        setData,
        post,
        clearErrors,
        errors,
        setError,
        processing,
        recentlySuccessful,
    } = useForm({
        user_id: auth.user?.id,
        papanBunga_id: papanBunga.id,
        harga: papanBunga.harga,
    });

    const addToCart: FormEventHandler = (e) => {
        // console.log(e);
        e.preventDefault();
        post(route('pb.addToCart', { slug: papanBunga.slug }));
        // router.get('/dashboards');
    };

    return (
        <MainLayout auth={auth}>
            <Head title={papanBungas[0].nama} />

            <div className="mx-auto max-w-6xl p-6">
                <div className="flex flex-col gap-14 sm:flex-row">
                    <div>
                        <img
                            src={
                                papanBungas[0].image
                                    ? `/storage/${papanBungas[0].image}`
                                    : `/storage/logo.png`
                            }
                            loading="lazy"
                            alt={papanBungas[0].slug}
                            width={1500}
                            className="rounded-lg object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
                            {papanBungas[0].nama}
                        </h1>
                        <p className="text-md mb-4 text-gray-600 dark:text-gray-400">
                            {formatDate(papanBungas[0].created_at)}
                        </p>

                        <p className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                            {rupiah(papanBungas[0].harga)}
                        </p>

                        {!papanBungas[0].is_tersedia ? (
                            <p className="text-xs text-red-500">
                                Tidak Tersedia
                            </p>
                        ) : (
                            <p className="text-xs text-emerald-500">Tersedia</p>
                        )}

                        <p className="text-gray-700 dark:text-gray-300">
                            {papanBungas[0].deskripsi ||
                                'No description available'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-7 left-1/2 z-10 w-full max-w-7xl -translate-x-1/2">
                <div
                    key={papanBungas[0].slug}
                    className="overflow-hidden rounded-lg bg-white shadow-md transition-all dark:bg-gray-800"
                >
                    <div className="flex flex-col items-start justify-between p-5 sm:flex-row sm:items-center">
                        <div className="flex flex-row items-start gap-4">
                            <img
                                src={
                                    papanBungas[0].image
                                        ? `/storage/${papanBungas[0].image}`
                                        : `/storage/logo.png`
                                }
                                alt={papanBungas[0].slug}
                                loading="lazy"
                                className="w-24 rounded-lg object-cover sm:w-20"
                            />
                            <div>
                                <h3 className="mb-2 text-lg font-light text-gray-900 dark:text-white sm:text-xl">
                                    {papanBungas[0].nama}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-md font-medium text-gray-900 dark:text-white">
                                        {rupiah(papanBungas[0].harga)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {papanBungas[0].is_tersedia ? (
                            <form onSubmit={addToCart}>
                                <div className="flex flex-row-reverse items-center gap-5 sm:flex-row">
                                    <div className="relative">
                                        <button
                                            // disabled={processing}
                                            className="mt-4 flex h-full items-center gap-2 rounded-md bg-[#FF2D20] px-3 py-3 text-xs font-medium text-white transition-colors hover:bg-[#FF2D20]/80 sm:mr-6 sm:mt-0 sm:px-6 sm:py-3 sm:text-xl"
                                        >
                                            <ShoppingCartIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                                            Tambah ke keranjang
                                        </button>
                                    </div>
                                </div>
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Ditambahkan ke keranjang
                                    </p>
                                </Transition>
                            </form>
                        ) : (
                            <button
                                disabled
                                className="mr-6 flex h-full items-center gap-2 rounded-md bg-[#FF2D20] px-6 py-3 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 sm:text-xl"
                            >
                                <ShoppingCartIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                                Not Available
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
