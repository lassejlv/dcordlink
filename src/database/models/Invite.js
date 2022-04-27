const mongoose = require("mongoose");

const DiscordInviteSchema = new mongoose.Schema({
  redirect: {
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
      discord_id: "",
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

  // Meta
  meta: {
    type: Object,
    default: {
      title: "",
      description: "",
      image: "",
      color: "",
    },
  },
});

module.exports = mongoose.model("DiscordInvite", DiscordInviteSchema);
