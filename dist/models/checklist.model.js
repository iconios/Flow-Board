import mongoose from "mongoose";
const ChecklistSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
        index: true,
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        index: true,
        required: true,
    },
    checked: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
const Checklist = mongoose.model("Checklist", ChecklistSchema);
export default Checklist;
//# sourceMappingURL=checklist.model.js.map