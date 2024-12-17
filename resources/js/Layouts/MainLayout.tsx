import Dropdown from '@/Components/Dropdown';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';

interface MainLayoutProps {
    children: React.ReactNode;
    auth: {
        user?: {
            name: string;
        };
        admin?: boolean;
        cart_count?: number | null;
    };
    header?: React.ReactNode;
}

export default function MainLayout({
    children,
    auth,
    header,
}: MainLayoutProps) {
    return (
        <>
            <div>
                <Toaster />
            </div>
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <div className="relative flex min-h-screen flex-col selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full px-6">
                        <header className="items-center">
                            <nav className="flex flex-1 justify-between">
                                <Link href={route('home')}>
                                    <img
                                        src="/storage/logo.png"
                                        alt="logo"
                                        width={150}
                                    />
                                </Link>
                                <div className="flex items-center gap-4">
                                    {auth.user ? (
                                        <>
                                            <Link
                                                href={route('dashboard')}
                                                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                            >
                                                <div className="relative">
                                                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                                        {auth.cart_count ?? 0}
                                                    </span>
                                                </div>

                                                <ShoppingCartIcon className="h-6 w-6" />
                                            </Link>
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <span className="inline-flex rounded-md">
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center rounded-md px-3 py-2 capitalize text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                                        >
                                                            {auth.user.name}
                                                            <svg
                                                                className="-me-0.5 ms-2 h-4 w-4"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                </Dropdown.Trigger>

                                                <Dropdown.Content>
                                                    {auth.admin && (
                                                        <a
                                                            className="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                                                            href="/admin"
                                                        >
                                                            Admin
                                                        </a>
                                                    )}
                                                    <Dropdown.Link
                                                        href={route(
                                                            'profile.edit',
                                                        )}
                                                    >
                                                        Profile
                                                    </Dropdown.Link>
                                                    <Dropdown.Link
                                                        href={route('logout')}
                                                        method="post"
                                                        as="button"
                                                    >
                                                        Log Out
                                                    </Dropdown.Link>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                            >
                                                Log in
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </nav>
                        </header>
                        {header && (
                            <header>
                                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                    {header}
                                </div>
                            </header>
                        )}

                        {children}
                    </div>
                    <footer className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <p className="text-center">
                                &copy; {new Date().getFullYear()} All rights
                                reserved.
                            </p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
