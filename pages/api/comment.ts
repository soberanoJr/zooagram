import type {NextApiRequest, NextApiResponse} from 'next';
import { mongoDbConnect } from '../../middlewares/mongoDbConnect';
import { jwtTokenValidation } from '../../middlewares/jwtTokenValidation';
import { PostModel } from '../../models/PostModel';
import { UserModel } from '../../models/UserModel';
import type {MessagePatterns} from '../../types/MessagePatterns';
import { corsHandler } from '../../middlewares/corsHandler';

const commentEndpoint = async (req : NextApiRequest, res : NextApiResponse<MessagePatterns>) => {
    try{
        if(req.method === 'PUT') {
            const {userId, id} = req.query;
            const user = await UserModel
                .findById(userId);
            if(!user) {
                return res
                    .status(400)
                    .json({error : 'User not found.'});
            }
            const post =  await PostModel
                .findById(id);
            if(!post) {
                return res
                    .status(400)
                    .json({error : 'Post not found.'});
            }
            if(!req.body || !req.body.comment || req.body.comment.length < 2) {
                return res
                    .status(400)
                    .json({error : 'Invalid comment.'});
            }
            const comment = {
                userId : user._id,
                name : user.name,
                comment : req.body.comment
            }
            post.comments
                .push(comment);
            await PostModel
                .findByIdAndUpdate({_id : post._id}, post);
            return res
                .status(200)
                .json({message : 'Comment successfully added.'});
        }
        return res
            .status(405)
            .json({error : 'Method not allowed.'});
    }catch(e){
        console
            .log(e);
        return res
            .status(500).json({error : 'Error adding comment.'});
    }
}
export default corsHandler(jwtTokenValidation(mongoDbConnect(commentEndpoint)));
