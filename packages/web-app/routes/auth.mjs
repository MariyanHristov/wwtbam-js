import * as bcrypt from "bcrypt";
import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { AUTH_SECRET } from "../../env/index.mjs";
import { query } from "../mysql.mjs";
import { verifyNoUser } from "../auth/verify-no-user.mjs";
import { verifyUser } from "../auth/verify-user.mjs";

const router = express.Router();

router.get("/login", verifyNoUser, (req, res) => {
    res.render("auth/login", { errors: null });
});

router.post(
    "/login",
    verifyNoUser,
    body("email").notEmpty().isEmail().normalizeEmail(),
    body("password").notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("auth/login", { errors: errors.mapped() });
        }

        const found = await query("select * from `users` where `email` = ?", [req.body.email]);

        if (found.length === 0) {
            return res.render("auth/login", {
                errors: { email: { msg: "Invalid credentials" } },
            });
        }

        const [user] = found;

        const passwordIsValid = await bcrypt.compare(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.render("auth/login", {
                errors: { email: { msg: "Invalid credentials" } },
            });
        }

        const payload = Object.fromEntries(
            ["id", "name", "family_name", "city", "country"].map((key) => [key, user[key]]),
        );

        const token = jwt.sign(payload, AUTH_SECRET, {
            expiresIn: "1h",
        });

        res.cookie("auth", token, { httpOnly: true });

        res.redirect("/");
    },
);

router.get("/logout", verifyUser, (req, res) => {
    res.clearCookie("auth", { httpOnly: true });

    res.redirect("/");
});

router.get("/register", verifyNoUser, (req, res) => {
    res.render("auth/register", { errors: null, values: {} });
});

router.post(
    "/register",
    verifyNoUser,
    body("first_name").isAlpha(),
    body("last_name").isAlpha(),
    body("email").isEmail().normalizeEmail(),
    body("password"),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("auth/register", { errors: errors.mapped(), values: req.body });
        }

        const found = await query("select count(*) as `result` from `users` where `email` = ?", [req.body.email]);

        if (found[0].result > 0) {
            return res.render("auth/register", {
                errors: { email: { msg: "User with that email already exists" } },
                values: req.body,
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await query(
            "insert into `users` (`name`, `family_name`, `city`, `email`, `password`, country) values (?, ?, ?, ?, ?, ?)",
            [req.body.first_name, req.body.last_name, "", req.body.email, hashedPassword, ""],
        );

        res.redirect("/auth/login");
    },
);

export default router;
