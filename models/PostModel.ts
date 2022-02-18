import mongoose, { Schema } from 'mongoose'

const PostSchema = new Schema({
    userId: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, required: true },
    datetime: { type: Date, required: true },
    comments: { type: Array, required: true, default: [] },
    likes: { type: Array, required: true, default: [] },
})

export const PostModel = (mongoose.models.post || mongoose.model('post', PostSchema))
