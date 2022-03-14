import type { NextApiRequest, NextApiResponse } from "next";
import type { MessagePatterns } from "../../types/MessagePatterns";
import { jwtTokenValidation } from "../../middlewares/jwtTokenValidation";
import { mongoDbConnect } from "../../middlewares/mongoDbConnect";
import { UserModel } from "../../models/UserModel";
import nc from 'next-connect';
import {upload, cosmicImageUpload} from '../../services/cosmicImageUpload'

const handler = nc()
    .use(upload.single('file'))
    .put(async (req: any, res: NextApiResponse<MessagePatterns>) => {
        try {
            const { userId } = req?.query;
            const user = await UserModel.findById(userId);
            
            if(!user) {
                return res.status(400).json({ error: `User ${user} not found.` });    
            }

            const { name } = req?.body;
            if(name && name.length > 2) {
                user.name = name;
            }

            const { file } = req;
            if(file && file.originalname) {
                // Send Multer image to Cosmic
                const image = await cosmicImageUpload(req);
                if(image && image.media && image.media.url) {
                    user.avatar = image.media.url;
                }
            }

            // Change data at db
            await UserModel.findByIdAndUpdate({ _id : user._id }, user);

            return res.status(200).json({ message: `User '${user.name}' successfully updated.` });

        } catch(e) {
            console.log(e);
            return res.status(400).json({ error: `${e}` });
        }
    })
    .get(async (req: NextApiRequest, res: NextApiResponse<MessagePatterns | any>) => {
        try {
            // Get user id
            const { userId } = req?.query;
            const user = await UserModel.findById(userId);
            user.password = null;
    
            return res.status(200).json(user);
        } catch(e) {
            console.log(e);
            return res.status(400).json({ error: `User data not available for now. (${e})` });
        };
    });

export const config = { api: { bodyParser: false }};

export default jwtTokenValidation(mongoDbConnect(handler));
