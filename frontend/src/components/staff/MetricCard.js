import React from "react";
import "../../style/StaffMetrics.css";

function MetricCard({ title, value, icon }) {
  return (
    <div className="sm-metric-card">
      <div className="sm-metric-icon">{icon}</div>
      <div className="sm-metric-content">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
      <div className="sm-metric-progress">
        <svg className="sm-metric-progress-ring" viewBox="0 0 42 42">
          <circle className="sm-metric-progress-bg" cx="21" cy="21" r="15.9"></circle>
          <circle className="sm-metric-progress-fill" cx="21" cy="21" r="15.9"></circle>
        </svg>
      </div>
    </div>
  );
}

export default MetricCard;
