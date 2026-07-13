"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CustomerForm() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  async function addCustomer(e) {

    e.preventDefault();

    const {
      data: { user }
    } = await supabase.auth.getUser();


    const { error } = await supabase
      .from("customers")
      .insert({
        user_id: user.id,
        name,
        email,
        company
      });


    if(error){
      alert(error.message);
      return;
    }


    alert("Klant toegevoegd!");

    setName("");
    setEmail("");
    setCompany("");
  }


return (

<form
onSubmit={addCustomer}
className="bg-white p-6 rounded-xl shadow space-y-4"
>


<input
className="border p-3 w-full rounded"
placeholder="Naam"
value={name}
onChange={(e)=>setName(e.target.value)}
/>


<input
className="border p-3 w-full rounded"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>


<input
className="border p-3 w-full rounded"
placeholder="Bedrijf"
value={company}
onChange={(e)=>setCompany(e.target.value)}
/>


<button
className="bg-black text-white px-5 py-3 rounded"
>
Klant toevoegen
</button>


</form>

)

}