"use client";

import jsPDF from "jspdf";


export default function InvoicePDF({invoice}) {


function generatePDF(){

const doc = new jsPDF();


doc.setFontSize(22);
doc.text(
"Invoice AI",
20,
30
);


doc.setFontSize(14);

doc.text(
`Factuurnummer: ${invoice.invoice_number}`,
20,
50
);


doc.text(
`Klant: ${invoice.customers?.name}`,
20,
70
);


doc.text(
`Bedrag: €${invoice.amount}`,
20,
90
);


doc.text(
"Bedankt voor uw vertrouwen!",
20,
120
);



doc.save(
`${invoice.invoice_number}.pdf`
);


}



return (

<button

onClick={generatePDF}

className="bg-blue-600 text-white px-4 py-2 rounded"

>

Download PDF

</button>

);


}