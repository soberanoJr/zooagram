import type { NextApiRequest, NextApiResponse } from "next";
import { corsHandler } from "../../middlewares/corsHandler";
import { jwtTokenValidation } from "../../middlewares/jwtTokenValidation";
import { mongoDbConnect } from "../../middlewares/mongoDbConnect";
import { PostModel } from "../../models/PostModel";
import { UserModel } from "../../models/UserModel";
import type { MessagePatterns } from "../../types/MessagePatterns";

const likeEndpoint = async (req : NextApiRequest, res: NextApiResponse<MessagePatterns>) => {
    try {
        if(req.method === 'PUT') {
            // Get post id
            const {id} = req?.query;
            const post = await PostModel.findById(id);
            console.log(id, post, req.method, req.query)
            if(!post) {
                return res.status(400).json({error : 'Post not found.'});
            }

            // Get user whose liked the post
            const {userId} = req?.query;
            const user = await UserModel.findById(userId);
            if(!user) {
                return res.status(400).json({error : 'User not found.'});
            }
            const userLikeIndex = post.likes.findIndex((e : any) => e.toString() === user._id.toString());
            if(userLikeIndex != -1) {
                post.likes.splice(userLikeIndex, 1);
                await PostModel.findByIdAndUpdate({ _id : post._id }, post);
                return res.status(200).json({ message: 'You disliked this post.' });
            } else {
                post.likes.push(user._id);
                await PostModel.findByIdAndUpdate({ _id : post._id }, post);
                return res.status(200).json({ message: 'You liked this post.' });
            }
        }
        return res.status(405).json({ error: 'Method not allowed.' });
    } catch(e) {
        console.log(e);
        return res.status(500).json({ error: `${e}` });
    }
}

export default corsHandler(jwtTokenValidation(mongoDbConnect(likeEndpoint)));