import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    status: {
        type: String,
        enum: ['active', 'archive'],
        default: 'active'
    },
    board_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
    },
    created_at: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
})