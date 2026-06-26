export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-4">
        <h2 className="text-xl font-bold mb-6">Invoice AI</h2>

        <nav className="flex flex-col gap-3">
          <a href="/dashboard">Dashboard</a>
          <a href="/dashboard/customers">Klanten</a>
          <a href="/dashboard/invoices">Facturen</a>
          <a href="/dashboard/settings">Instellingen</a>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}