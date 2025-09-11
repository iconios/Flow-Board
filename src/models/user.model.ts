import mongoose from "mongoose";
import type { UserCreateType } from "../types/user.type.js";
import crypto from "node:crypto";
import * as dotenv from "dotenv";
dotenv.config();

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const UserSchema = new mongoose.Schema(
  {
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
    resetPasswordToken: {
      type: String,
      default: null,
      index: true,
    },
    resetPasswordTokenExpires: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

// Generate hashed verification token
UserSchema.method("generateVerificationToken", async function () {
  const unHashedCrypto = crypto.randomBytes(32).toString("hex");
  this.verificationToken = crypto
    .createHash("sha256")
    .update(unHashedCrypto)
    .digest("hex");
  this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
});

// Generate hashed password reset token
UserSchema.method("generatePasswordResetToken", async function () {
  const unHashedCrypto = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(unHashedCrypto)
    .digest("hex");
  this.resetPasswordTokenExpires = new Date(Date.now() + 30 * 60 * 1000);
});

const User = mongoose.model<UserCreateType>("User", UserSchema);

export default User;
