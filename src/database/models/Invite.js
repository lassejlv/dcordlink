const mongoose = require("mongoose");

const DiscordInviteSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },

  slug: {
    type: String,
    required: true,
    unique: true,
  },

  createdBy: {
    type: Object,
    default: {
      id: "",
      username: "",
      discriminator: "",
      avatar: "",
    },

    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Analytics
  clicks: {
    type: Number,
    default: 0,
  },

  views: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("DiscordInvite", DiscordInviteSchema);