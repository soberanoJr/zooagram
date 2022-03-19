import type { NextApiResponse } from "next";
import nc from "next-connect";
import type { MessagePatterns } from "../../types/MessagePatterns";
import { mongoDbConnect } from "../../middlewares/mongoDbConnect";
import { jwtTokenValidation } from "../../middlewares/jwtTokenValidation";
import { upload, cosmicImageUpload } from "../../services/cosmicImageUpload";
import { UserModel } from "../../models/UserModel";
import { PostModel } from "../../models/PostModel";
import { corsHandler } from "../../middlewares/corsHandler";

const handler = nc()
    .use(upload .single('file'))
    .post(async (req: any, res: NextApiResponse<MessagePatterns>) => {
        try {
            const {userId}  = req.query;
            const user = await UserModel.findById(userId);
            const {text} = req.body;

            // Send Multer image to Cosmic
            const image = await cosmicImageUpload(req); 

            if(!user) { return res.status(400).json({ error: "User not found" });};
            if(!req || !req.body) { return res.status(400).json({ error: "Missing post" }); };
            if(!text) { return res.status(400).json({ error: "Missing text" }); };
            if(!req.file || !req.file.originalname) { return res.status(400).json({ error: "Missing image" }); };

            // Save data
            const post = {
                userId: user._id,
                text,
                image: image.media.url,
                datetime: new Date,
            };

            user.posts++;
            await UserModel.findByIdAndUpdate({_id : user._id}, user);

            console.log(user.posts);
            await PostModel.create(post);
            return res.status(200).json({ message: "Posted" });
        } catch(e) {
            console.log(e);
            return res.status(400).json({ error: `${e}` });
        }
    });

export const config = { api: { bodyParser: false }};

export default corsHandler(jwtTokenValidation(mongoDbConnect(handler)));
