// 1. Load Environment Variables First
require("dotenv").config();

// 2. Import All Required Packages
const express = require("express");
const mongoose = require("mongoose");
const Coffee = require("./models/Coffee");

// 3. Initialize the Express Application
const app = express();

// 4. Set Up Middleware & View Engine
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// 5. App Routes
// Home Page Route
app.get("/", async (req, res) => {
  try {
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
  } catch (err) {
    console.error("Error loading home page:", err);
    res.status(500).send("Database Error");
  }
});

// Vote Route
app.post("/vote/:id", async (req, res) => {
  try {
    await Coffee.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: 1 } }
    );
    res.redirect("/");
  } catch (err) {
    console.error("Error casting vote:", err);
    res.status(500).send("Voting Error");
  }
});

// 6. Connect to MongoDB, THEN Start Listening
mongoose.connect(process.env.MONGO_URI, {
  family: 4
})
.then(() => {
  console.log("MongoDB Connected Successfully! 🎉");
  
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
})
.catch(err => {
  console.error("MongoDB Connection Error: ", err);
});
