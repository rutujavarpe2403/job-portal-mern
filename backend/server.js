require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Job Portal API is running" });
});

app.use("/auth", require("./routes/authRoutes"));
app.use("/jobs", require("./routes/jobRoutes"));
app.use("/companies", require("./routes/companyRoutes"));
app.use("/applications", require("./routes/applicationRoutes"));
app.use("/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();