require("dotenv").config();
const router = require("express").Router();
const { ensureAuth } = require("../middleware/requireAuth");
const Link = require("../database/models/Link");
const axios = require("axios");

let url = "https://discord.com/api/v8/invites/";

router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Link routes

// @desc    Get the current users links
// @route   GET /api/v1/links
// @access  Private
router.get("/v1/links", (req, res) => {
  Link.find({ owner: req.user.id })
    .then((links) => res.json(links))
    .catch((err) => res.status(500).json({ msg: "Server error" }));
});

// @desc    Create a link
// @route   POST /api/v1/links
// @access  Private
router.post("/v1/links", (req, res) => {
  axios.get(`${url}/${req.body.code}`).then((response) => {
    console.log(response.data);
  });
});

// @desc    Update a link
// @route   PUT /api/v1/links
// @access  Private
router.put("/v1/links", (req, res) => {
  res.send("Update link");
});

// @desc    Delete a link
// @route   DELETE /api/v1/links
// @access  Private
router.delete("/v1/links", (req, res) => {
  res.send("Delete link");
});

module.exports = router;
