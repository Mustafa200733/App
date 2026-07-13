import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold">Invoice AI</h1>

      <p className="mt-4 text-gray-600">
        Maak professionele facturen met AI.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/login"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="border px-6 py-3 rounded-lg"
        >
          Register
        </Link>
      </div>
    </main>
  );
}