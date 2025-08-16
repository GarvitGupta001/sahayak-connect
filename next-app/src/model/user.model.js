import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: [true, "Phone number must be unique"],
        minlength: [10, "Phone number must be at least 10 characters long"],
        maxlength: [10, "Phone number must be at most 10 characters long"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
    },
    profileComplete: {
        type: Boolean,
        default: false,
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
