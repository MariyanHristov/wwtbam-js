export function verifyNoUser(req, res, next) {
    if (req.loggedInUserID) {
        res.json({status: 401, message: "You're already logged in."});
        return;
    }

    next();
}
