const express = require("express");
const userRoutes = require("./routes/userRoutes");
const recordRoutes = require("./routes/recordRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const connectDB = require("./config/db");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
require("dotenv").config();

const app = express();

// connect to database
connectDB();

// middleware
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// test route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});