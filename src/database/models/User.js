const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    discordId: { type: String, required: true },
    username: { type: String, required: true },
    discriminator: { type: String, required: true },
    maxLinks: { type: Number, default: 3 },
    role: { type: Number },
    banned: { type: Boolean, default: false },
    avatar: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
