import { useEffect } from "react";
import DeviceStateChart from "./components/DeviceStateChart";
import ModbusStateChart from "./components/ModbusStateChart";
import "./index.css";

function App() {
  useEffect(() => {
    const data = fetch("http://192.168.171.64:5001/device_states_all");
    data
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Segoe UI, sans-serif",
        backgroundColor: "#f3f4f6",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          background: "linear-gradient(to bottom right, #1f2937, #374151)",
          color: "#fff",
          padding: "30px 20px",
          boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ fontSize: "22px", marginBottom: "30px" }}>Dashboard</h2>
        <ul style={{ listStyle: "none", padding: 0, lineHeight: "2rem" }}>
          <li style={{ cursor: "pointer" }}>Modbus State Chart</li>
          <li style={{ cursor: "pointer" }}>Device State Chart</li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "30px",
          overflowY: "scroll",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
          WebkitOverflowScrolling: "touch", // iOS smooth
        }}
        onWheel={(e) => {
          e.currentTarget.style.scrollbarWidth = "none";
        }}
      >
        <div style={{ paddingRight: "10px" }}>
          {/* Header Title */}
          <h1
            style={{
              fontSize: "26px",
              marginBottom: "20px",
              color: "#1f2937",
              borderBottom: "2px solid #e5e7eb",
              paddingBottom: "10px",
            }}
          >
            Real-time Device Monitoring Dashboard
          </h1>

          <ModbusStateChart />
          <DeviceStateChart />
        </div>
      </div>
    </div>
  );
}

export default App;
