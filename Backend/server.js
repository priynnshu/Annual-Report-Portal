
const express = require("express");
const cors = require("cors");
const reportRoutes = require("./routes/reportRoutes");
require("dotenv").config();

const departmentRoutes = require("./routes/departmentRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Annual Report Portal API is running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend connected successfully",
  });
});

// Department APIs
app.use("/api/departments", departmentRoutes);
app.use("/api/reports", reportRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
