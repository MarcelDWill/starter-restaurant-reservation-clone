const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

const reservationsRouter = require("./reservations/reservations.router");
const tablesRouter = require("./tables/tables.router");

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",  // Replace with your frontend Render URL
    optionsSuccessStatus: 200,
  };

app.use(cors(corsOptions));
app.use(express.json());

app.use("/reservations", reservationsRouter);
app.use("/tables", tablesRouter);

app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Backend is running.");
  });

module.exports = app;
