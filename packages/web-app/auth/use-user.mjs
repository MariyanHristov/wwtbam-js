import jwt from "jsonwebtoken";

import {AUTH_SECRET} from "../../env/index.mjs";

export function useUser(req, res, next) {
    const authCookie = req.cookies.auth;

    if (!authCookie) {
        return next();
    }

    jwt.verify(authCookie, AUTH_SECRET, (error, decoded) => {
        if (!error) {
            // Save to request for use in routes
            req.loggedInUserID = decoded.id;
            req.loggedInUserData = decoded;
        }

        next();
    });
}
