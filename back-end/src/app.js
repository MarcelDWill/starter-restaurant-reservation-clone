const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

const reservationsRouter = require("./reservations/reservations.router");
const tablesRouter = require("./tables/tables.router");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",  // Allow local development
  "https://starter-restaurant-reservation-clone.onrender.com"  // Allow deployed frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200  // Handle legacy browsers
};

app.use(cors(corsOptions));
app.options("*", cors());  // Handle preflight requests
app.use(express.json());

// Health check route for root path
app.get("/", (req, res) => {
  res.send("Backend is running and available.");
});

app.use("/reservations", reservationsRouter);
app.use("/tables", tablesRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
