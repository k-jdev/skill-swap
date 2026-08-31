import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="max-w-md text-slate-600">
        The page you are looking for does not exist or was moved.
      </p>
      <Link
        href="/"
        className="rounded-full bg-primary px-5 py-2 font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Back home
      </Link>
    </main>
  );
}
