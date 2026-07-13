"use client";

import { useEffect, useState } from "react";
import InvoicePDF from "@/components/InvoicePDF";
import InvoiceForm from "@/components/InvoiceForm";
import { supabase } from "@/lib/supabase";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);

  async function loadInvoices() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("invoices")
      .select(`*, customers(name)`)
      .eq("user_id", user.id);

    setInvoices(data || []);
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Facturen</h1>
      <InvoiceForm />

      <div className="mt-8 space-y-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-bold text-xl">{invoice.invoice_number}</h2>
            <p>Klant: {invoice.customers?.name}</p>
            <p>Bedrag: €{invoice.amount}</p>
            <p>Status: {invoice.status}</p>
            <InvoicePDF invoice={invoice} />
          </div>
        ))}
      </div>
    </div>
  );
}
