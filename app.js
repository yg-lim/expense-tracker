const config = require("./lib/config");
const express = require("express");
const morgan = require("morgan");

const app = express();
const PORT = config.PORT;
const HOST = config.HOST;

app.set("view engine", "pug");

app.use(morgan("common"));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/expenses");
});

app.get("/expenses", (req, res) => {
  res.render("expenses");
});

app.listen(PORT, HOST, () => {
  console.log(`listening on ${PORT}`);
});