import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-10">Invoice AI</h1>

      <nav className="space-y-3">
        <Link className="block hover:text-blue-400" href="/dashboard">
          Dashboard
        </Link>

        <Link className="block hover:text-blue-400" href="/dashboard/customers">
          Klanten
        </Link>

        <Link className="block hover:text-blue-400" href="/dashboard/invoices">
          Facturen
        </Link>

        <Link className="block hover:text-blue-400" href="/dashboard/settings">
          Instellingen
        </Link>
        <Link 
className="block hover:text-blue-400"
href="/dashboard/ai"
>
AI Assistant
</Link>
      </nav>
    </aside>
  );
}