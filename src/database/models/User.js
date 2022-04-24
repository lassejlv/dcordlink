const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  username: { type: String, required: true },
  discriminator: { type: String, required: true },
  avatar: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
