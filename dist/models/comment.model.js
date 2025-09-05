import mongoose from "mongoose";
const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
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
});
const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
//# sourceMappingURL=comment.model.js.map
