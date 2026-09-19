import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[70vh] place-content-center gap-6 pt-32 text-center">
      <p className="font-display text-7xl text-gold-soft sm:text-8xl">404</p>
      <h1 className="font-display text-3xl sm:text-4xl">This page has slipped out of time.</h1>
      <p className="mx-auto max-w-md text-mist">
        The page you are looking for has moved or never existed. Try the collection instead.
      </p>
      <div className="flex justify-center gap-3">
        <Link href="/products" className="btn btn-gold">
          Browse watches
        </Link>
        <Link href="/" className="btn btn-ghost">
          Back home
        </Link>
      </div>
    </section>
  );
}
