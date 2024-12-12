import Pagination from '@/Components/Pagination';
import MainLayout from '@/Layouts/MainLayout';
import { formatDate, rupiah } from '@/lib/utils';
import { PageProps, PapanBunga } from '@/types';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    data: PapanBunga[];
}

export default function Welcome({
    auth,
    papanBunga: initialPapanBunga,
}: PageProps<{
    papanBunga: PaginationData;
}>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [papanBunga, setPapanBunfa] = useState(initialPapanBunga);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 14;

    const filteredPapanBunga = papanBunga.data.filter((papanBunga) =>
        papanBunga.nama.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredPapanBunga.length / itemsPerPage);
    const paginatedPapanBunga = filteredPapanBunga.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Optionally scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Reset to first page when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <MainLayout auth={auth}>
            <Head title="Welcome" />
            <main className="mt-6">
                <div className="mb-8 text-center">
                    <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white">
                        Selamat Datang di Aziyo Florist
                    </h1>
                    <p className="mt-2 text-xl text-gray-600 dark:text-gray-400">
                        Cari papan bunga kesukaan mu disini!
                    </p>
                </div>
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Cari jenis papan bunga..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                {paginatedPapanBunga.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-7">
                            {paginatedPapanBunga.map(
                                (papanBunga: PapanBunga) => (
                                    <Link
                                        key={papanBunga.slug}
                                        href={`/papan-bunga/${papanBunga.slug}`}
                                        className={`overflow-hidden rounded-lg bg-white shadow-md transition-all hover:bg-gray-100 hover:shadow-inner dark:bg-gray-800 dark:hover:bg-gray-700 ${
                                            !papanBunga.is_tersedia
                                                ? 'opacity-60'
                                                : ''
                                        }`}
                                    >
                                        <div className="p-5">
                                            <img
                                                src={
                                                    papanBunga.image
                                                        ? `/storage/${papanBunga.image}`
                                                        : `/storage/logo.png`
                                                }
                                                alt={papanBunga.nama}
                                                loading="lazy"
                                                width={400}
                                                height={600}
                                                className="mb-4 h-full w-full rounded-lg object-cover"
                                            />
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {formatDate(
                                                    papanBunga.created_at,
                                                )}
                                            </p>
                                            <h3 className="mb-2 text-sm font-light text-gray-900 dark:text-white">
                                                {papanBunga.nama}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <span className="text-md font-medium text-gray-900 dark:text-white">
                                                    {rupiah(papanBunga.harga)}
                                                </span>
                                            </div>
                                            {!papanBunga.is_tersedia ? (
                                                <p className="text-xs text-red-500">
                                                    Not Available
                                                </p>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </Link>
                                ),
                            )}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            lastPage={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <ExclamationCircleIcon className="h-56 w-56 text-gray-600 dark:text-gray-400" />
                            <p className="text-2xl text-gray-600 dark:text-gray-400">
                                Ga ketemu nih yang kamu cari
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </MainLayout>
    );
}
