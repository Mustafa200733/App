export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500">Omzet</h2>
          <p className="text-2xl font-bold">€0</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500">Klanten</h2>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500">Facturen</h2>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}