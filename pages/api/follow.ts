import type { NextApiRequest, NextApiResponse } from "next";
import type { MessagePatterns } from "../../types/MessagePatterns";
import { jwtTokenValidation } from "../../middlewares/jwtTokenValidation";
import { mongoDbConnect } from "../../middlewares/mongoDbConnect";
import { UserModel } from "../../models/UserModel";
import { FollowerModel } from "../../models/FollowerModel";
import { corsHandler } from "../../middlewares/corsHandler";

const followEndpoint = async (req : NextApiRequest, res: NextApiResponse<MessagePatterns>) => {
    try {
        if(req.method === 'PUT'){
            // Query for auth user
            const {userId, id} = req?.query;
            const user = await UserModel
                .findById(userId);
            console.log(user);
            if(!user){
                return res
                    .status(400)
                    .json({error : 'User not found.'});
            }

            // Query for user to be followed
            const followed = await UserModel
                .findById(id);
            console.log(followed);    
            if(!followed){
                return res
                    .status(400)
                    .json({error : 'Followed not found.'});
            }

            // Tango
            const isFollowed = await FollowerModel
                .find({followerId : user._id, followedId : followed._id});

            if(isFollowed && isFollowed.length > 0){
                isFollowed
                    .forEach(async(e : any) => await FollowerModel
                    .findByIdAndDelete({_id : e._id}));
                user.following--;
                await UserModel
                    .findByIdAndUpdate({_id : user._id}, user);
                followed.followers--;
                await UserModel
                    .findByIdAndUpdate({_id : followed._id}, followed);

                return res
                    .status(200)
                    .json({message : 'Successfully unfollowing.'});
            } else{
                const follower = {
                    followerId : user._id,
                    followedId : followed._id 
                }
                await FollowerModel
                    .create(follower);
                
                // Add a followed to user's following count
                user.following++;
                await UserModel
                    .findByIdAndUpdate({_id : user._id}, user);
                
                // Add a follower to followed's followers count <wtf>
                followed.followers++;
                await UserModel
                    .findByIdAndUpdate({_id : followed._id}, followed);

                return res
                    .status(200)
                    .json({message : 'Successfully following.'});
            }
        }
        return res
            .status(405)
            .json({ error: 'Method not allowed.' });
    } catch(e) {
        console
            .log(e);
        return res
            .status(500)
            .json({ error: `${e}` });
    }
}

export default corsHandler(jwtTokenValidation(mongoDbConnect(followEndpoint)));