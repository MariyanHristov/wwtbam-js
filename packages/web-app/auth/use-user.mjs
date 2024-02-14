import jwt from "jsonwebtoken";
import secret from "./secret.mjs";

export function useUser(req, res, next) {
    const authCookie = req.cookies.auth;

    if (!authCookie) {
        return next();
    }

    jwt.verify(authCookie, secret, (error, decoded) => {
        if (!error) {
            // Save to request for use in routes
            req.loggedInUserID = decoded.id;
            req.loggedInUserData = decoded;
        }

        next();
    });
}
