const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const cors = require("cors"); // Import cors

dotenv.config();

const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allowed origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies or authorization headers
  optionsSuccessStatus: 204,
};

const app = express();
app.use(cors(corsOptions));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
