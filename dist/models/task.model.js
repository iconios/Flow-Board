import mongoose from "mongoose";
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    dueDate: Date,
    priority: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        default: "low",
    },
    position: Number,
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
        index: true,
    },
}, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
    },
});
const Task = mongoose.model("Task", TaskSchema);
export default Task;
//# sourceMappingURL=task.model.js.map