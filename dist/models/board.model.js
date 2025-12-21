import mongoose from "mongoose";
const BoardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        max: 25,
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
        index: true,
    },
    lists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "List",
            required: false,
            index: true,
        },
    ],
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
});
const Board = mongoose.model("Board", BoardSchema);
export default Board;
//# sourceMappingURL=board.model.js.map