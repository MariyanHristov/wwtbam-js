import "dotenv/config";
import path from "path";
import {fileURLToPath, URL} from "url";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.mjs";
import gameRouter from "./routes/game.mjs";
import {verifyUser} from "./auth/verify-user.mjs";
import {useUser} from "./auth/use-user.mjs";
import {query} from "./mysql.mjs";
import {onUpgrade as onUpgradeToGame} from "./web-connector.mjs";

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set(
    "views",
    path.join(path.dirname(fileURLToPath(import.meta.url)), "views")
);

app.use("/auth", authRouter);
app.use("/game", gameRouter);

app.use("/restricted", useUser, verifyUser, async (req, res) => {
    if (!req.loggedInUserID) {
        return res.send(`Hello! You're not logged in.`);
    }

    const found = await query("select * from `users` where `id` = ?", [
        req.loggedInUserID,
    ]);

    res.send(
        `Hello, ${found[0].name} ${found[0].family_name}! Here is some top secret stuff...`
    );
});

const port = 3000;

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

server.on("upgrade", function (request, socket, head) {
    const {pathname} = new URL(
        request.url,
        `${request.protocol}://${request.headers.host}/`
    );

    if (pathname === "/game") {
        onUpgradeToGame(request, socket, head);
    }
});
