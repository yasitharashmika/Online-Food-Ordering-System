import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import AdminLayout from "../components/admin/AdminLayout";
import API_BASE_URL from "../config";
import "../style/AdminReport.css";

// This is a required step to register the components Chart.js needs
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/reports/dashboard-summary`);
        setReportData(res.data);
      } catch (err) {
        setError("Failed to fetch report data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  // Prepare data structure for the Sales Trend chart
  const salesChartData = {
    labels: reportData ? Object.keys(reportData.salesByDate).sort() : [],
    datasets: [
      {
        label: "Daily Sales ($)",
        data: reportData ? Object.keys(reportData.salesByDate).sort().map(date => reportData.salesByDate[date]) : [],
        borderColor: "rgba(251, 221, 24, 0.8)",
        backgroundColor: "rgba(251, 221, 24, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Prepare data structure for the Order Status chart
  const statusChartData = {
    labels: reportData ? Object.keys(reportData.orderStatusCounts) : [],
    datasets: [
      {
        label: "Order Status",
        data: reportData ? Object.values(reportData.orderStatusCounts) : [],
        backgroundColor: [
          "#27ae60", // Green 
          "#f1c40f", // Yellow
          "#3498db", // Blue
          "#e74c3c", // Red
          "#95a5a6", // Grey
          "#8e44ad"  // Purple
        ],
        hoverOffset: 4,
        borderColor: '#1e1e1e',
        borderWidth: 2,
      },
    ],
  };
  
  // Common chart options for a dark theme
  const chartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        position: 'top',
        labels: { color: '#f5f5f5', font: { size: 14 } } 
      },
      title: {
        display: true,
        text: title,
        color: '#f5f5f5',
        font: { size: 18 }
      }
    },
    scales: { 
        x: { ticks: { color: '#f5f5f5' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
        y: { ticks: { color: '#f5f5f5' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } } 
    }
  });

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: { color: '#f5f5f5', font: { size: 14 } }
        },
        title: {
            display: true,
            text: 'Order Status Distribution',
            color: '#f5f5f5',
            font: { size: 18 }
        }
    }
  };


  if (loading) {
    return <AdminLayout><div className="report-loading">📊 Loading report...</div></AdminLayout>;
  }

  if (error) {
    return <AdminLayout><div className="report-error">{error}</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <section className="report-section">
        <h1 className="report-title">📊 Sales & Order Analytics</h1>
        <p className="report-subtitle">Summary of the last 30 days</p>

        {/* KPI Cards */}
        <div className="report-kpi-grid">
          <div className="kpi-card">
            <h2>Total Revenue</h2>
            <p>${reportData?.totalRevenue.toFixed(2) || "0.00"}</p>
          </div>
          <div className="kpi-card">
            <h2>Total Orders</h2>
            <p>{reportData?.totalOrders || "0"}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="report-chart-grid">
          <div className="chart-card">
            <Line data={salesChartData} options={chartOptions('Daily Sales Trend')} />
          </div>
          <div className="chart-card">
            <Doughnut data={statusChartData} options={doughnutOptions} />
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}