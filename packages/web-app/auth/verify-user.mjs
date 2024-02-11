export function verifyUser(req, res, next) {
    if (!req.loggedInUserID) {
        res.json({status: 401, message: "You're not logged in."});
        return;
    }

    next();
}
