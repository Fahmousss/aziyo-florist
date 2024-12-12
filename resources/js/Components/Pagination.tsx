interface PaginationProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    lastPage,
    onPageChange,
}: PaginationProps) {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        // Always show first page
        pages.push(1);

        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(lastPage - 1, currentPage + 1);

        // Adjust if we're near the start
        if (currentPage <= 3) {
            endPage = Math.min(maxVisiblePages - 1, lastPage - 1);
        }

        // Adjust if we're near the end
        if (currentPage >= lastPage - 2) {
            startPage = Math.max(2, lastPage - 3);
        }

        // Add ellipsis if needed
        if (startPage > 2) {
            pages.push('...');
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add ellipsis if needed
        if (endPage < lastPage - 1) {
            pages.push('...');
        }

        // Always show last page if there is more than one page
        if (lastPage > 1) {
            pages.push(lastPage);
        }

        return pages;
    };

    return (
        <div className="mt-6 flex justify-center gap-2">
            {currentPage > 1 && (
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                    Previous
                </button>
            )}

            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() =>
                        typeof page === 'number' ? onPageChange(page) : null
                    }
                    disabled={typeof page !== 'number'}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        typeof page !== 'number'
                            ? 'text-gray-500'
                            : page === currentPage
                              ? 'bg-zinc-500 text-white hover:bg-zinc-500/80'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                    }`}
                >
                    {page}
                </button>
            ))}

            {currentPage < lastPage && (
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                    Next
                </button>
            )}
        </div>
    );
}
