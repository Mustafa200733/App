"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DashboardCard from "@/components/DashboardCard";


export default function Dashboard() {

  const [stats, setStats] = useState({
    customers: 0,
    invoices: 0,
    revenue: 0
  });


  async function loadStats() {

    const {
      data:{user}
    } = await supabase.auth.getUser();


    const { data: customers } =
      await supabase
      .from("customers")
      .select("id")
      .eq("user_id", user.id);



    const { data: invoices } =
      await supabase
      .from("invoices")
      .select("amount")
      .eq("user_id", user.id);



    const revenue = invoices?.reduce(
      (total, invoice) =>
        total + Number(invoice.amount),
      0
    );


    setStats({
      customers: customers?.length || 0,
      invoices: invoices?.length || 0,
      revenue: revenue || 0
    });


  }



  useEffect(()=>{

    loadStats();

  },[]);



  return (

    <div>

      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>


      <div className="grid md:grid-cols-3 gap-6">


        <DashboardCard
          title="Klanten"
          value={stats.customers}
        />


        <DashboardCard
          title="Facturen"
          value={stats.invoices}
        />


        <DashboardCard
          title="Omzet"
          value={`€${stats.revenue}`}
        />


      </div>


    </div>

  );

}