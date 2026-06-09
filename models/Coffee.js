const mongoose = require("mongoose");

const coffeeSchema = new mongoose.Schema({
  name: String,
  votes: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Coffee", coffeeSchema);