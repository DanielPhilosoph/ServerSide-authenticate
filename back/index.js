require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoute = require("./routers/user");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
module.exports = app;
