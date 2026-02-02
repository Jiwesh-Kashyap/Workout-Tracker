const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { createToken } = require("../services/authn");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.pre("save", async function () {
    //before you save , do this
    const user = this;
    if (!user.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
});

userSchema.static(
    "matchPasswordAndGenerateToken",
    async function (email, password) {
        const user = await this.findOne({ email });

        if (!user) {
            throw new Error("No user found!");
        }
        const userSalt = user.salt;
        const userPasswordHash = user.password;

        console.log("Comparing provided password:", password);
        console.log("With stored hash:", userPasswordHash);

        const isMatch = await bcrypt.compare(password, userPasswordHash);
        console.log("is Match: ", isMatch);

        if (isMatch) {
            const token = createToken(user);
            return token;
        } else throw new Error("Incorrect Password!");
    }
);

const USER = mongoose.model("user", userSchema);

module.exports = USER;
