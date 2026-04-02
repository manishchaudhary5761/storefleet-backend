import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetpasswordExpire: Date
});

// hash password
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

// Generate reset token
userSchema.methods.getResetPasswordToken = function(){
    const token = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    
    this.resetpasswordExpire = Date.now() + 10 * 60 * 1000;

    return token;
};

export default mongoose.model("User", userSchema);