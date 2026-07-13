export default function DashboardCard({
title,
value
}){


return (

<div className="bg-white p-6 rounded-xl shadow">

<p className="text-gray-500">
{title}
</p>


<h2 className="text-3xl font-bold mt-3">
{value}
</h2>


</div>

)

}