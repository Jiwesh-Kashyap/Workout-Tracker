const express = require("express");
const router = express.Router();
const USER = require("../models/user");
const { createToken } = require("../services/authn");

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const findUser = await USER.findOne({ email });
        if (!findUser) {
            return res.status(401).json({ message: "Incorrect email or password!!" });
        }
        const token = await USER.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false, // Set to true if using HTTPS
            path: "/"
        }).status(200).json({ message: "Login Successful", user: { name: findUser.name, email: findUser.email } });
    } catch (error) {
        console.error("Signin Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/signup", async (req, res, next) => {
    const { name, email, password } = req.body;

    const duplicateUser = await USER.findOne({ email });
    if (duplicateUser) {
        return res.status(401).json({ message: "Email already in use!" });
    }

    try {
        console.log("[SIGNUP DEBUG] Creating user:", { name, email });
        await USER.create({
            name,
            email,
            password,
        });
        console.log("[SIGNUP DEBUG] User created successfully");

        // Auto-login: Generate token and set cookie
        const token = createToken({ _id: (await USER.findOne({ email }))._id, name, email });

        return res.status(201).cookie("token", token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false, // Set to true if using HTTPS
            path: "/"
        }).json({ message: "User created successfully" });
    } catch (error) {
        console.error("[SIGNUP DEBUG] Error creating user:", error);
        return res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

module.exports = router;