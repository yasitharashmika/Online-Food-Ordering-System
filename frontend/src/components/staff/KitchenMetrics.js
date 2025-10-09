import React from "react";
import MetricCard from "./MetricCard";
import "../../style/StaffMetrics.css";

function KitchenMetrics({ metrics }) {
  const metricData = [
    { title: "Orders In Queue", value: metrics.ordersInQueue, icon: "🕒" },
    { title: "Preparing", value: metrics.preparing, icon: "🔥" },
    { title: "Ready for Pickup", value: metrics.readyForPickup, icon: "✅" },
  ];

  return (
    <div className="metrics-container">
      {metricData.map((metric, index) => (
        <MetricCard 
          key={index} 
          title={metric.title} 
          value={metric.value} 
          icon={metric.icon} 
        />
      ))}
    </div>
  );
}

export default KitchenMetrics;
