import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-6xl font-bold text-primary-500 dark:text-primary-400">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-lg mt-2 text-center">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/" className="mt-6 px-6 py-3 bg-primary-600 text-black rounded-lg shadow-md hover:bg-primary-700 transition duration-300">
        Go back to Home
      </Link>
    </div>
  );
}
