import {Router} from "express";

import User from "../models/user/User.mjs";

const router = Router();

router.get("/:id([0-9]+)", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.getById(userId);

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        res.render("user/userProfile", {user, title: "User Profile"});
    } catch (error) {
        res.status(500).send("yes");
    }
});

router.post("/update", async (req, res) => {
    try {
        const userId = req.body.id;
        const user = await User.getById(userId);

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        user.setUser(req.body);

        await user.update((err, updatedUser) => {
            if (err) {
                res.status(500).send("Internal Server Error");
            } else {
                res.redirect(`/user/${updatedUser.id}`);
            }
        });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

export default router;
