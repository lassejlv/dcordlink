const Link = require("../database/models/Link");
const { generate } = require("yourid");

module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/auth/discord");
    }
  },

  ensureEditPermissions: function (req, res, next) {
    Link.findOne({ _id: req.params.id, owner: req.user.id }).then((link) => {
      if (link) {
        return next();
      } else {
        res.redirect("/dash");
      }
    });
  },

  ensurePermissions: function (req, res, next) {
    Link.findOne({ _id: req.params.id, owner: req.user.id }).then((link) => {
      if (link) {
        return next();
      } else {
        res.redirect("/dash");
      }
    });
  },

  ensureAdmin: function (req, res, next) {
    if (req.user.role === 2) {
      return next();
    } else {
      res.redirect("/");
    }
  },

  ensureBanned: function (req, res, next) {
    if (req.isAuthenticated() && req.user.banned === false) {
      return next();
    } else {
      res.redirect("/dash/banned");
    }
  },

  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      return next();
    }
  },
};
