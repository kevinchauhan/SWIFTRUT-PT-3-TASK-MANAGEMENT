import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        required: true,
        lowercase: true,
        default: "user",
    },
});

export default mongoose.model("User", userSchema);