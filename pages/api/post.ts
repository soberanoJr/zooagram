import type { NextApiResponse } from "next";
import nc from "next-connect";
import type { MessagePatterns } from "../../types/MessagePatterns";
import { mongoDbConnect } from "../../middlewares/mongoDbConnect";
import { jwtTokenValidation } from "../../middlewares/jwtTokenValidation";
import { upload, cosmicImageUpload } from "../../services/cosmicImageUpload";
import { UserModels } from "../../models/UserModels";
import { PostModel } from "../../models/PostModel";

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: any, res: NextApiResponse<MessagePatterns>) => {
        try {
            const { userId } = req.query;
            const user = await UserModels.findById(userId);
            const { text } = req.body;

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

            await PostModel.create(post);
            return res.status(200).json({ message: "Posted" });
        } catch(e) {
            console.log(e);
            return res.status(400).json({ error: `${e}` });
        }
    });

export const config = { api: { bodyParser: false }};

export default jwtTokenValidation(mongoDbConnect(handler));
