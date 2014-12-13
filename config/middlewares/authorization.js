/**
 * The authorization middleware should come here!
 */
exports.isAuthenticated = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    next();
};