import * as bcrypt from "bcrypt";
import express from "express";
import {body, validationResult} from "express-validator";
import jwt from "jsonwebtoken";

import {AUTH_SECRET} from "../../env/index.mjs";
import {query} from "../mysql.mjs";
import {useUser} from "../auth/use-user.mjs";
import {verifyNoUser} from "../auth/verify-no-user.mjs";

const router = express.Router();

router.get("/login", useUser, verifyNoUser, (req, res) => {
    res.render("auth/login", {errors: null});
});

router.post(
    "/login",
    useUser,
    verifyNoUser,
    body("email").notEmpty().isEmail().normalizeEmail(),
    body("password").notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("auth/login", {errors: errors.mapped()});
        }

        const found = await query("select * from `users` where `email` = ?", [
            req.body.email,
        ]);

        if (found.length === 0) {
            return res.render("auth/login", {
                errors: {email: {msg: "Invalid credentials"}},
            });
        }

        const [user] = found;

        const passwordIsValid = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.render("auth/login", {
                errors: {email: {msg: "Invalid credentials"}},
            });
        }

        const payload = Object.fromEntries(
            ["id", "name", "family_name", "city", "country"].map((key) => [
                key,
                user[key],
            ])
        );

        const token = jwt.sign(payload, AUTH_SECRET, {
            expiresIn: "1h",
        });

        res.cookie("auth", token, {httpOnly: true});

        res.redirect("/");
    }
);

router.get("/register", useUser, verifyNoUser, (req, res) => {
    res.render("auth/register");
});

router.post(
    "/register",
    useUser,
    verifyNoUser,
    body("first_name").isAlpha(),
    body("last_name").isAlpha(),
    body("email").isEmail().normalizeEmail(),
    body("password"),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const found = await query(
            "select count(*) as `result` from `users` where `email` = ?",
            [req.body.email]
        );

        if (found[0].result > 0) {
            // user found, error
            return res.status(400);
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await query(
            "insert into `users` (`name`, `family_name`, `city`, `email`, `password`, country) values (?, ?, ?, ?, ?, ?)",
            [
                req.body.first_name,
                req.body.last_name,
                "",
                req.body.email,
                hashedPassword,
                "",
            ]
        );

        res.redirect("/auth/login");
    }
);

export default router;
