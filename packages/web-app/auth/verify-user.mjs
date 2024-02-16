export function verifyUser(req, res, next) {
    if (!req.loggedInUserID) {
        res.render("message", { title: "Error", message: "You're not logged in." });
        return;
    }

    next();
}
