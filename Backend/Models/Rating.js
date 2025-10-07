const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Rating", ratingSchema);
