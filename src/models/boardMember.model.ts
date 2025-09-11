import mongoose from "mongoose";

const BoardMemberSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
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
  },
  {
    timestamps: {
      createdAt: "created_at",
    },
  },
);

const BoardMember = mongoose.model("Board_Member", BoardMemberSchema);

export default BoardMember;
