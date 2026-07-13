import DashboardCard from "@/components/DashboardCard";

export default function Dashboard(){

return (

<div>

<h1 className="text-4xl font-bold mb-8">
Dashboard
</h1>


<div className="grid grid-cols-3 gap-6">

<DashboardCard
title="Klanten"
value="0"
/>


<DashboardCard
title="Facturen"
value="0"
/>


<DashboardCard
title="Omzet"
value="€0"
/>


</div>

</div>

)

}