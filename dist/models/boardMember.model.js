import mongoose from "mongoose";
import crypto from "node:crypto";
const BoardMemberSchema = new mongoose.Schema({
    board_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        index: true,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "member"],
        default: "member",
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
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
// Generate hashed verification token
BoardMemberSchema.method("generateVerificationToken", async function () {
    const unHashedCrypto = crypto.randomBytes(32).toString("hex");
    this.verificationToken = crypto
        .createHash("sha256")
        .update(unHashedCrypto)
        .digest("hex");
    this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
});
const BoardMember = mongoose.model("BoardMember", BoardMemberSchema);
export default BoardMember;
//# sourceMappingURL=boardMember.model.js.map