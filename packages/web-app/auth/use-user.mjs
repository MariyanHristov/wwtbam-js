import jwt from "jsonwebtoken";
import secret from "./secret.mjs";

export function useUser(req, res, next) {
    const authCookie = req.cookies.auth;

    if (!authCookie) {
        return next();
    }

    jwt.verify(authCookie, secret, function (error, decoded) {
        if(error) {
            res.json({
                status: 403,
                message: "Invalid login.",
                error,
            });

            return;
        }

        // if everything good, save to request for use in other routes
        req.loggedInUserID = decoded.id;
        next();
    });
}
