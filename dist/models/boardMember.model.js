import mongoose from "mongoose";
const BoardMemberSchema = new mongoose.Schema({
  board_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});
const Board_Member = mongoose.model("Board_Member", BoardMemberSchema);
export default Board_Member;
//# sourceMappingURL=boardMember.model.js.map
