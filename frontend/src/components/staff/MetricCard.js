import React from "react";
import "../../style/StaffMetrics.css";

function MetricCard({ title, value, icon }) {
  return (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
      <div className="metric-progress">
        <svg className="metric-progress-ring" viewBox="0 0 42 42">
          <circle className="metric-progress-bg" cx="21" cy="21" r="15.9"></circle>
          <circle className="metric-progress-fill" cx="21" cy="21" r="15.9"></circle>
        </svg>
      </div>
    </div>
  );
}

export default MetricCard;
