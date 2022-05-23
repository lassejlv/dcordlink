const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    discordId: { type: String, required: true },
    username: { type: String, required: true },
    discriminator: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
