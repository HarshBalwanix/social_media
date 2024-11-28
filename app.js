const express = require("express");
const connectDB = require("./config/db");
const expressListEndpoints = require("express-list-endpoints");
const cookieParser = require("cookie-parser");
const userRoutes = require("./user_app/routes/user_routes");
const postRoutes = require("./post_app/routes/post_routes");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api", userRoutes);
app.use("/api", postRoutes);

app.get("/api", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.status(200).send({
    message: "Welcome to the SOCIAL MEDIA API !! ",
    app_endpoints: endpoints,
  });
});

module.exports = app;
