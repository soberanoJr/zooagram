import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    posts: { type: Number, default: 0 },
})

export const UserModels = (mongoose.models.user || mongoose.model('user', UserSchema))
