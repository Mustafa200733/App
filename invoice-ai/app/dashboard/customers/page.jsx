"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CustomerForm from "@/components/CustomerForm";


export default function Customers(){

const [customers,setCustomers]=useState([]);



async function getCustomers(){

const {
data:{user}
}=await supabase.auth.getUser();


const {data,error}=await supabase
.from("customers")
.select("*")
.eq("user_id",user.id);


if(!error){
setCustomers(data);
}

}



useEffect(()=>{

getCustomers();

},[]);



return(

<div>


<h1 className="text-4xl font-bold mb-8">
Klanten
</h1>


<CustomerForm />


<div className="mt-8 space-y-4">


{
customers.map(customer=>(

<div
key={customer.id}
className="bg-white p-5 rounded-xl shadow"
>


<h2 className="text-xl font-bold">
{customer.name}
</h2>


<p>
{customer.company}
</p>


<p className="text-gray-500">
{customer.email}
</p>


</div>

))
}


</div>


</div>

)

}