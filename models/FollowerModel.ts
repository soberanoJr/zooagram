import mongoose, { Schema } from 'mongoose'

const FollowerSchema = new Schema({
    followerId: { type: String, required: true },
    followedId: { type: String, required: true }
})

export const FollowerModel = (mongoose.models.followers || mongoose.model('followers', FollowerSchema))
