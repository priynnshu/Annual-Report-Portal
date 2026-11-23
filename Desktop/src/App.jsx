
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [status, setStatus] = useState("Connecting...");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch(
          "http://localhost:4000/api/health"
        );

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();

        setStatus("Connected");
        setMessage(data.message);
      } catch (error) {
        setStatus("Disconnected");
        setMessage("Unable to connect to the backend.");
        console.error(error);
      }
    }

    checkBackend();
  }, []);

  return (
    <div className="app">
      <h1>Annual Report Portal</h1>
      <p>Institute-wide Annual Reporting System</p>

      <div className="status-card">
        <h2>Backend Status: {status}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default App;
