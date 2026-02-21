const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        req.flash('error', 'You must be logged in to access this page');
        return res.redirect('/login');
    }
    next();
};

const setCurrentUser = (req, res, next) => {
    res.locals.currentUser = req.session.userId;
    next();
};

module.exports = { requireAuth, setCurrentUser };