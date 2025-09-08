import mongoose from "mongoose";

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
  created_at: {
    type: Date,
    default: new Date(Date.now()),
    immutable: true,
  },
});

const BoardMember = mongoose.model("Board_Member", BoardMemberSchema);

export default BoardMember;
