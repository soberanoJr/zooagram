import type { NextApiRequest, NextApiResponse } from "next";
import type { MessagePatterns } from "../../types/MessagePatterns";
import { jwtTokenValidation } from "../../middlewares/jwtTokenValidation";
import { mongoDbConnect } from "../../middlewares/mongoDbConnect";
import { UserModels } from "../../models/UserModels";


const userEndpoint = async (req: NextApiRequest, res: NextApiResponse<MessagePatterns>) => {
    try {
        // Get user id
        const { userId } = req?.query;
        const user = await UserModels.findById(userId);
        user.password = null;

        return res.status(200).json(user);
    } catch(e) {
        console.log(e);
        return res.status(400).json({ error: `User data not available for now (${e})` });
    };
};

export default jwtTokenValidation(mongoDbConnect(userEndpoint));
