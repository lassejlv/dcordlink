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
