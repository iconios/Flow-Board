import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    due_date: Date,
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    position: Number,
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    activity_logs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    list_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      index: true,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
