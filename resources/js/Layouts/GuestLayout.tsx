import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 dark:bg-gray-900 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <img
                        src="/storage/logo.png"
                        alt="Logo"
                        width={300}
                        height={300}
                        className="mx-auto box-content object-cover"
                    />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md dark:bg-gray-800 sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
