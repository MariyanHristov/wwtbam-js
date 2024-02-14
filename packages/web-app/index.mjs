import path from "path";
import {fileURLToPath, URL} from "url";

import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import {APP_PORT} from "../env/index.mjs";
import authRouter from "./routes/auth.mjs";
import gameRouter from "./routes/game.mjs";
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

const server = app.listen(APP_PORT, () => {
    console.log(`Listening on port ${APP_PORT}`);
});

server.on("upgrade", (req, socket, head) => {
    const {pathname} = new URL(
        req.url,
        `${req.protocol}://${req.headers.host}/`
    );

    if (pathname === "/game") {
        onUpgradeToGame(req, socket, head);
    }
});
