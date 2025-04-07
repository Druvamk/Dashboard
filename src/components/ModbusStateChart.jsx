import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const ModbusStateChart = () => {
  const [modbusData, setModbusData] = useState(null);

  const fetchStateData = async () => {
    try {
      const response = await axios.get(
        "http://192.168.29.192:5001/device_states"
      );
      setModbusData(response.data);
    } catch (error) {
      console.error("Failed to fetch Modbus state data:", error);
    }
  };

  useEffect(() => {
    fetchStateData();
    const interval = setInterval(fetchStateData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!modbusData)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
          fontSize: "18px",
          color: "#6B7280",
          fontFamily: "Segoe UI, sans-serif",
        }}
      >
        Loading chart data...
      </div>
    );

  const labels = Object.keys(modbusData);
  const dataValues = labels.map((key) => modbusData[key].state);
  const backgroundColors = dataValues.map((value) =>
    value === 2 ? "rgba(255, 99, 132, 0.7)" : "rgba(75, 192, 192, 0.7)"
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Device State (1 = Normal, 2 = Anomaly)",
        data: dataValues,
        backgroundColor: backgroundColors,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            family: "Segoe UI",
          },
        },
      },
      title: {
        display: true,
        text: "Modbus Device States (Live)",
        font: {
          size: 20,
          family: "Segoe UI",
        },
        color: "#111827",
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (val) =>
            val === 1 ? "Normal" : val === 2 ? "Anomaly" : val,
          font: {
            size: 14,
            family: "Segoe UI",
          },
        },
        grid: {
          color: "#E5E7EB",
        },
      },
      x: {
        ticks: {
          font: {
            size: 14,
            family: "Segoe UI",
          },
        },
        grid: {
          color: "#F3F4F6",
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "90%",
        maxWidth: "900px",
        margin: "40px auto",
        padding: "30px",
        background: "linear-gradient(to bottom right, #f8fafc, #e0f7fa)",
        borderRadius: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "22px",
          color: "#1F2937",
        }}
      >
        Modbus Device States – Normal (1) or Anomaly (2)
      </h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default ModbusStateChart;
