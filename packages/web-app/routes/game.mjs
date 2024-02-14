import express from "express";

import {verifyUser} from "../auth/verify-user.mjs";
import {useUser} from "../auth/use-user.mjs";

// TEMP:
import fs from "fs";
import {v4 as uuid} from "uuid";
import {createBus} from "../../bus/index.mjs";
import {fileURLToPath} from "url";
import {dirname} from "path";

const router = express.Router();

router.get("/", useUser, verifyUser, (req, res) => {
    res.render("game/enter-code");
});

router.get("/new", useUser, verifyUser, async (req, res) => {
    const bus = createBus();
    await bus.connect();

    const dir = `${dirname(
        dirname(dirname(dirname(fileURLToPath(import.meta.url))))
    )}/misc`;

    const id = uuid();

    await bus.send({
        type: "newGame",
        id,
        questions: fs
            .readdirSync(`${dir}/questions`)
            .map((name) =>
                JSON.parse(String(fs.readFileSync(`${dir}/questions/${name}`)))
            ),
    });

    await bus.disconnect();

    res.redirect(303, `/game/${id}`);
});

router.get("/:id", useUser, verifyUser, (req, res) => {
    res.render("game/play", {
        auth: req.cookies.auth,
        playerID: req.loggedInUserID,
    });
});

export default router;
