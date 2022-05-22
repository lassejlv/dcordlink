const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please enter a code"],
    },

    slug: {
      type: String,
      required: [true, "Please add a slug"],
      unique: [true, "Slug already in use."],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Please add a name"],
    },

    guild: {
      type: String,
      required: [true, "Please add a guild id"],
    },

    icon: {
      type: String,
      required: [true, "Please add an icon"],
    },

    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Link", LinkSchema);
