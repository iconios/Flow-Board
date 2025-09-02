import mongoose from 'mongoose';
import { UserCreate } from '../types/user.create.type';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password_hash: {
        type: String,
        required: true,
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

const User = mongoose.model<UserCreate>('User', UserSchema);

export default User;