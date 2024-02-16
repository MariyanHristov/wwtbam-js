export function verifyNoUser(req, res, next) {
    if (req.loggedInUserID) {
        res.render("message", { title: "Error", message: "You're already logged in." });
        return;
    }

    next();
}
