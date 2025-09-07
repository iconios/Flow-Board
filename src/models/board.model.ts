import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: 25
  },
  bg_color: {
    type: String,
    default: "#ffffff",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: {
    type: Date,
    default: new Date(),
    immutable: true,
  },
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: false,
    },
  ],
  updated_at: {
    type: Date,
    default: new Date(),
  },
});

const Board = mongoose.model("Board", BoardSchema);

export default Board;
