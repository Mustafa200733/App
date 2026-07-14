"use client";

import { useState } from "react";


export default function AIInvoiceGenerator(){

const [service,setService]=useState("");
const [result,setResult]=useState("");
const [loading,setLoading]=useState(false);



async function generateText(){

	if(!service){
		alert("Vul eerst een dienst in");
		return;
	}

	try{
		setLoading(true);

		const res = await fetch('/api/ai', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ prompt: service }),
		});

		// parse safely: some server errors return empty or non-JSON bodies
		const bodyText = await res.text();
		let data = null;
		try {
			data = bodyText ? JSON.parse(bodyText) : null;
		} catch (e) {
			// not JSON — keep raw text
			data = { text: bodyText };
		}

		if (!res.ok) {
			const err = data?.error || data?.text || 'Er ging iets mis bij het genereren.';
			setResult(err);
			return;
		}

		// prefer `text`, fall back to other properties
		const aiText = (data && (data.text || data.output_text)) || (data && data);
		const note = data?.fallback ? ' (lokaal fallback-antwoord)' : data?.warning ? ` (warning: ${data.warning})` : '';
		setResult((typeof aiText === 'string' ? aiText : JSON.stringify(aiText)) + note);

	}catch(err){
		setResult('Fout: ' + (err.message || err));
	}finally{
		setLoading(false);
	}

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
	disabled={loading}
	className={"bg-black text-white px-5 py-3 rounded " + (loading ? 'opacity-60 cursor-not-allowed' : '')}
>
	{loading ? 'Genereren…' : 'Genereer met AI'}

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