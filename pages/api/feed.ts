import type { NextApiRequest, NextApiResponse } from "next";
import type { MessagePatterns } from "../../types/MessagePatterns";
import { jwtTokenValidation } from "../../middlewares/jwtTokenValidation";
import { mongoDbConnect } from "../../middlewares/mongoDbConnect";
import { UserModel } from "../../models/UserModel";
import { PostModel } from "../../models/PostModel";
import { FollowerModel } from "../../models/FollowerModel";
import { corsHandler } from "../../middlewares/corsHandler";

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<MessagePatterns | any>) => {
    try {
        if(req.method === 'GET'){
            if(req?.query?.userId){
                const user = await UserModel
                    .findById(req?.query?.userId);
                if(!user) {
                    return res
                        .status(400)
                        .json({ error: "User not found" });
                };
                const posts = await PostModel
                    .find({ userId: user._id })
                    .sort({ datetime: -1 });

                console
                    .log(req.query);
                return res
                    .status(200)
                    .json(posts);
            } else{
                const {userId} = req.query;
                const user = await UserModel
                    .findById(userId);
                if(!user){
                    return res
                        .status(400)
                        .json('User not found.');
                }

                const followers = await FollowerModel
                    .find({followerId : user});
                const followersIds = followers.map(f => f.followedId);
                const posts = await PostModel
                    .find({
                        $or : [
                            {userId : user._id},
                            {userId : followersIds}
                        ]
                    })
                    .sort({datetime : -1});
                const result = [];
                for(const post of posts) {
                    const postUser = await UserModel.findById(post.userId);
                    if(postUser) {
                        const final = {...post._doc, user : { 
                            name : postUser.name, 
                            avatar: postUser.avatar
                        }};
                        result.push(final);
                    }
                }
                return res
                    .status(200)
                    .json({result});
            }
        }
        console
            .log(req.method);
        console
            .log(req.query.userId);
        return res
            .status(405)
            .json({ error: "This method is not allowed" });
    } catch(e) {
        console
            .log(e);
    };
    return res
        .status(400)
        .json({ error: "Missing Feed" });
};

export default corsHandler(jwtTokenValidation(mongoDbConnect(feedEndpoint)));
