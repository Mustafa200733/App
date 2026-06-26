export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold">Invoice AI</h1>
      <p className="mt-2 text-gray-600">
        Maak facturen en offertes in seconden
      </p>

      <div className="mt-6 flex gap-4">
        <a href="/login" className="px-4 py-2 bg-black text-white rounded">
          Login
        </a>
        <a href="/register" className="px-4 py-2 border rounded">
          Register
        </a>
      </div>
    </main>
  );
}