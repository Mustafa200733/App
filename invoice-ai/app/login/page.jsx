export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
}