import path from "path";
import { fileURLToPath, URL } from "url";

import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { APP_PORT } from "../env/index.mjs";
import authRouter from "./routes/auth.mjs";
import gameRouter from "./routes/game.mjs";
import homeRouter from "./routes/home.mjs";
import questionBankBrowseRouter from "./routes/question-bank-browse.mjs";
import questionBankRouter from "./routes/question-bank.mjs";
import userRouter from "./routes/user.mjs";
import { onUpgrade as onUpgradeToGame } from "./web-connector.mjs";
import { useUser } from "./auth/use-user.mjs";

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");

app.set("views", path.join(path.dirname(fileURLToPath(import.meta.url)), "views"));

app.use(useUser);

app.use("/public", express.static("public"));

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/browse", questionBankBrowseRouter);
app.use("/question-bank", questionBankRouter);
app.use("/game", gameRouter);
app.use("/", homeRouter);

const server = app.listen(APP_PORT, () => {
    console.log(`Listening on port ${APP_PORT}`);
});

server.on("upgrade", (req, socket, head) => {
    const { pathname } = new URL(req.url, `${req.protocol}://${req.headers.host}/`);

    if (pathname === "/game") {
        onUpgradeToGame(req, socket, head);
    }
});
