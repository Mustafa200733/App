"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function InvoiceForm() {

  const [customers,setCustomers] = useState([]);
  const [customerId,setCustomerId] = useState("");
  const [amount,setAmount] = useState("");



  useEffect(()=>{

    async function getCustomers(){

      const {
        data:{user}
      } = await supabase.auth.getUser();


      const {data} = await supabase
        .from("customers")
        .select("*")
        .eq("user_id",user.id);


      setCustomers(data || []);

    }


    getCustomers();

  },[]);



  async function createInvoice(e){

    e.preventDefault();


    const {
      data:{user}
    } = await supabase.auth.getUser();



    const invoiceNumber =
      "INV-" + Math.floor(Math.random()*100000);



    const {error}=await supabase
    .from("invoices")
    .insert({

      user_id:user.id,
      customer_id:customerId,
      invoice_number:invoiceNumber,
      amount:Number(amount),
      status:"open"

    });



    if(error){

      alert(error.message);
      return;

    }


    alert("Factuur gemaakt!");

    setAmount("");

  }



return (

<form
onSubmit={createInvoice}
className="bg-white p-6 rounded-xl shadow space-y-4"
>


<select
className="border p-3 w-full rounded"
value={customerId}
onChange={(e)=>setCustomerId(e.target.value)}
>

<option>
Selecteer klant
</option>


{
customers.map(customer=>(

<option
key={customer.id}
value={customer.id}
>

{customer.name}

</option>

))
}


</select>



<input

className="border p-3 w-full rounded"

placeholder="Bedrag"

type="number"

value={amount}

onChange={(e)=>setAmount(e.target.value)}

/>



<button
className="bg-black text-white px-5 py-3 rounded"
>

Factuur maken

</button>


</form>

)


}