import jwt from "jsonwebtoken";

import { AUTH_SECRET } from "../../env/index.mjs";

export async function parseAuthToken(authToken) {
    return new Promise((resolve, reject) => {
        jwt.verify(authToken, AUTH_SECRET, (error, decoded) => {
            if (error) {
                reject(error);
            } else {
                resolve(decoded);
            }
        });
    });
}
