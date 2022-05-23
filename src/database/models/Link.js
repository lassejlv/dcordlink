const mongoose = require("mongoose");
const slugify = require("slugify");

const LinkSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    guild: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
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

// use slugify to format the slug
LinkSchema.pre("save", function (next) {
  this.slug = slugify(this.slug, {
    lower: true,
    strict: true,
  });
  next();
});

module.exports = mongoose.model("Link", LinkSchema);
