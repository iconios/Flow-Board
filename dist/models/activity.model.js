import mongoose from "mongoose";
const ActivitySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  activity_type: {
    type: String,
    enum: ["move", "edit", "create"],
    required: true,
  },
  object: {
    type: String,
    enum: ["Board", "Task"],
    required: true,
  },
  object_id: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "object",
    required: true,
  },
});
//# sourceMappingURL=activity.model.js.map
