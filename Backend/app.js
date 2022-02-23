const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { Sequelize } = require("sequelize");

const path = require("path");

const userRoutes = require("./routes/user");

const app = express();

const sequelize = new Sequelize("test", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use(helmet());

app.use(cors());

app.use("/api/user", userRoutes);

module.exports = app;
