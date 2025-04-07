import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DEVICE_COLORS = {
  dosing_pump: "#4CAF50",
  lime_dosing_pump: "#2196F3",
  sand_filter: "#FF9800",
  tt_reset_button: "#9C27B0",
  tt_sim001_button: "#00BCD4",
  tt_sim002_button: "#FF5722",
  tt_sim003_button: "#8BC34A",
};

const OFF_COLOR = "#E0E0E0";

const DeviceStatePieChart = () => {
  const [deviceList, setDeviceList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllDevices, setShowAllDevices] = useState(false);

  useEffect(() => {
    axios
      .get("http://192.168.29.192:5001/device_states_all")
      .then((res) => {
        const entries = Object.entries(res.data).map(([key, value]) => ({
          name: key,
          ...value,
        }));
        setDeviceList(entries);
      })
      .catch((err) => console.error("Error fetching device data", err));
  }, []);

  const handleNext = () => {
    setShowAllDevices(false);
    setCurrentIndex((prev) => (prev + 1) % deviceList.length);
  };

  const handleReset = () => {
    setShowAllDevices(true);
  };

  const currentDevice = deviceList[currentIndex];

  const pieDataSingle = currentDevice
    ? [
        { name: "ON", value: currentDevice.state === 1 ? 1 : 0.0001 },
        { name: "OFF", value: currentDevice.state === 0 ? 1 : 0.0001 },
      ]
    : [];

  const pieDataAll = deviceList.map((device) => ({
    name: device.name.replace(/_/g, " "),
    value: device.state,
    color: DEVICE_COLORS[device.name] || "#9E9E9E",
  }));

  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
        fontFamily: "Segoe UI, sans-serif",
        background: "linear-gradient(to bottom right, #f3f4f6, #e0e7ff)",
        borderRadius: "16px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        margin: "40px auto",
        width: "90%",
        maxWidth: "800px",
      }}
    >
      {showAllDevices ? (
        <>
          <h2
            style={{ fontSize: "24px", color: "#374151", marginBottom: "10px" }}
          >
            All Devices - ON States
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieDataAll}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {pieDataAll.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </>
      ) : currentDevice ? (
        <>
          <h2
            style={{ fontSize: "24px", color: "#374151", marginBottom: "4px" }}
          >
            {currentDevice.name.replace(/_/g, " ")}
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            <strong>Register Address:</strong> {currentDevice.registerAddress}
          </p>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieDataSingle}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieDataSingle.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      index === 0
                        ? DEVICE_COLORS[currentDevice.name] || "#9C27B0"
                        : OFF_COLOR
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p style={{ fontSize: "18px", color: "#9CA3AF" }}>
          Loading device data...
        </p>
      )}

      <div
        style={{ marginTop: "30px", display: "flex", justifyContent: "center" }}
      >
        <button
          onClick={handleNext}
          style={{
            backgroundColor: "#2563EB",
            color: "#fff",
            padding: "12px 24px",
            marginRight: "16px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Show Next Device
        </button>

        <button
          onClick={handleReset}
          style={{
            backgroundColor: "#6B7280",
            color: "#fff",
            padding: "12px 24px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Reset to All
        </button>
      </div>
    </div>
  );
};

export default DeviceStatePieChart;
