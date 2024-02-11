import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.mjs";
import { verifyUser } from "./auth/verify-user.mjs";
import { useUser } from "./auth/use-user.mjs";
import { query } from "./mysql.mjs";

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set('views', path.join(path.dirname(fileURLToPath(import.meta.url)), 'views'));

app.use("/auth", authRouter);

app.use("/restricted", useUser, async (req, res) => {
    if(!req.loggedInUserID) {
        return res.send(`Hello! You're not logged in.`,);
    }

    const found = await query("select * from `users` where `id` = ?", [
        req.loggedInUserID,
    ]);

    res.send(
        `Hello, ${found[0].name} ${found[0].family_name}! Here is some top secret stuff...`,
    );
});

const port = 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
