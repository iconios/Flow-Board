import mongoose, { type Date } from "mongoose";

const ActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  activityType: {
    type: String,
    enum: ["move", "edit", "create", "delete"],
    required: true,
  },
  object: {
    type: String,
    enum: ["Board", "Task", "Comment", "Checklist", "List"],
    required: true,
  },
  objectId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "object",
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

ActivitySchema.index({ userId: 1 });
ActivitySchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 180 * 24 * 60 * 60 },
);

const Activity = mongoose.model("Activity", ActivitySchema);

export default Activity;
