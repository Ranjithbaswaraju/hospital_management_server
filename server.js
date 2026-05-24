const express = require("express");
const app = express();
const port = 3100;

const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://hospital-management-client-eight.vercel.app",
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/uploads",
  express.static("uploads")
);

const { ConnectDB } = require("./configure_db/db");

ConnectDB();

const authRoutes = require("./Routes/auth_routes");
const adminRoutes = require("./Routes/admin_routes");
const appointmentRoutes = require("./Routes/appointment_routes");
const doctorRoutes = require("./Routes/doctor_routes");
const patientRoutes = require("./Routes/patient_routes");

app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", doctorRoutes);
app.use("/api", patientRoutes);

app.listen(port);