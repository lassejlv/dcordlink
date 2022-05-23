const Link = require("../database/models/Link");

module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
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

  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      return next();
    }
  },
};
