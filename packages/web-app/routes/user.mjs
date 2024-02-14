import { Router } from "express";

import User from "../models/user/User.mjs";
import { verifyUser } from "../auth/verify-user.mjs";

const router = Router();

router.get("/", verifyUser, async (req, res) => {
    try {
        const userId = req.loggedInUserID;
        const user = await User.getById(userId);

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        res.render("user/userProfile", { user, title: "User Profile" });
    } catch (error) {
        res.status(500).send("yes");
    }
});

router.post("/", async (req, res) => {
    try {
        const userId = req.loggedInUserID;
        const user = await User.getById(userId);

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        user.setUser(req.body);
        user.id = userId;

        await user.update((err, updatedUser) => {
            if (err) {
                res.status(500).send("Internal Server Error");
            } else {
                res.redirect(`/user`);
            }
        });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

export default router;
