require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Coffee = require("./models/Coffee");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://sherin38558_db_user:IKSHANA_123@coffeedb.tbutpzu.mongodb.net/?appName=CoffeeDB", {
  family: 4,
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// Home Page
app.get("/", async (req, res) => {

  let coffees = await Coffee.find();

  if (coffees.length === 0) {

    await Coffee.insertMany([
      { name: "Espresso" },
      { name: "Latte" },
      { name: "Cappuccino" }
    ]);

    coffees = await Coffee.find();
  }

  res.render("index", { coffees });
});


// Vote Route
app.post("/vote/:id", async (req, res) => {

  await Coffee.findByIdAndUpdate(
    req.params.id,
    { $inc: { votes: 1 } }
  );

  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Running");
});