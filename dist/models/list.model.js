import mongoose from "mongoose";
const ListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    position: {
        type: Number,
        default: 1,
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            index: true,
        },
    ],
    status: {
        type: String,
        enum: ["active", "archive"],
        default: "active",
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: true,
        index: true,
    },
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
const List = mongoose.model("List", ListSchema);
export default List;
//# sourceMappingURL=list.model.js.map