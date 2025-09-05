import mongoose from "mongoose";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
dotenv.config();
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  verificationTokenExpires: {
    type: Date,
    default: null,
  },
  resetPasswordToken: String,
  resetPasswordTokenExpires: Date,
});
// Generate hashed verification token
UserSchema.method("generateVerificationToken", async function () {
  const unHashedCrypto = crypto.randomBytes(32).toString("hex");
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.verificationToken = await bcrypt.hash(unHashedCrypto, salt);
  this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
});
// Generate hashed password reset token
UserSchema.method("generatePasswordResetToken", async function () {
  const unHashedCrypto = crypto.randomBytes(32).toString("hex");
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.resetPasswordToken = await bcrypt.hash(unHashedCrypto, salt);
  this.resetPasswordTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);
});
const User = mongoose.model("User", UserSchema);
export default User;
//# sourceMappingURL=user.model.js.map
