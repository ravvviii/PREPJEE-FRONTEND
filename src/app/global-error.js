'use client';

// Replaces the entire root layout when it throws, so this stays deliberately
// minimal/self-contained — no dependency on Providers or shadcn components.
export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center font-sans">
        <p className="text-sm font-medium text-red-600">500</p>
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="max-w-sm text-gray-500">The application hit an unexpected error. Please try again.</p>
        <button onClick={reset} className="rounded-md bg-black px-4 py-2 text-white">
          Try again
        </button>
      </body>
    </html>
  );
}
