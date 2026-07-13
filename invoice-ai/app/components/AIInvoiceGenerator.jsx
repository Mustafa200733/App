"use client";

import { useState } from "react";


export default function AIInvoiceGenerator(){

const [service,setService]=useState("");
const [result,setResult]=useState("");



function generateText(){

if(!service){
alert("Vul eerst een dienst in");
return;
}


const text = `
Professionele factuuromschrijving:

Dienst: ${service}

Omschrijving:
Wij hebben deze dienst professioneel uitgevoerd 
met aandacht voor kwaliteit, betrouwbaarheid en
een goede klanttevredenheid.
`;

setResult(text);


}



return (

<div className="bg-white p-6 rounded-xl shadow">


<h2 className="text-2xl font-bold mb-4">
AI Factuur Assistent
</h2>


<input

className="border p-3 rounded w-full mb-4"

placeholder="Bijvoorbeeld: Website maken"

value={service}

onChange={(e)=>setService(e.target.value)}

/>


<button

onClick={generateText}

className="bg-black text-white px-5 py-3 rounded"

>

Genereer met AI

</button>



{
result && (

<div className="mt-6 bg-gray-100 p-4 rounded">

{result}

</div>

)
}



</div>

)


}