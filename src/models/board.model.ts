import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
    title: String,
    bg_color: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    created_at: {
        type: Date,
        default: Date.now(),
        immutable: true,
    },
    lists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    }],
    updated_at: Date
})

const Board = mongoose.model('Board', BoardSchema)

export default Board;