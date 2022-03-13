import type { NextApiRequest, NextApiResponse } from "next";
import type { MessagePatterns } from "../../types/MessagePatterns";
import { jwtTokenValidation } from "../../middlewares/jwtTokenValidation";
import { mongoDbConnect } from "../../middlewares/mongoDbConnect";
import { UserModels } from "../../models/UserModels";
import { PostModel } from "../../models/PostModel";

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<MessagePatterns | any>) => {
    try {
        if(req.method === 'GET') {
            if(req?.query?.userId) {
                const user = await UserModels.findById(req?.query?.userId);
                if(!user) {
                    return res.status(400).json({ error: "User not found" });
                };
                const posts = await PostModel
                    .find({ userId: user._id })
                    .sort({ datetime: -1 });

                console.log(req.query)
                return res.status(200).json(posts);
            };
        };
        console.log(req.method);
        console.log(req.query.userId);
        return res.status(405).json({ error: "This method is not allowed" });
    } catch(e) {
        console.log(e);
    };
    return res.status(400).json({ error: "Missing Feed" });
};

export default jwtTokenValidation(mongoDbConnect(feedEndpoint));
