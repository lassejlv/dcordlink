const DiscordInvite = require("../database/models/Invite");

module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },

  ensureEditPermissions: function (req, res, next) {
    DiscordInvite.findById(req.params.id).then((invite) => {
      if (invite.createdBy.id === req.user.id) {
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
