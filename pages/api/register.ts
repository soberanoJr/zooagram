import md5 from "md5";
import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";
import type { MessagePatterns } from "../../types/MessagePatterns";
import type { RegisterRequest } from "../../types/RegisterRequest";
import { UserModel } from "../../models/UserModel";
import { mongoDbConnect } from "../../middlewares/mongoDbConnect";
import { upload, cosmicImageUpload } from "../../services/cosmicImageUpload"

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<MessagePatterns>) => {
        const user = req.body as RegisterRequest;

        // Validate username 
        if(!user.name || user.name.length < 2) {
            return res.status(400).json({ error: "Invalid username" });
        };
        const userAlreadyRegistered = await UserModel.find({ name: user.name })
        if(userAlreadyRegistered && userAlreadyRegistered.length > 0) {
            return res.status(400).json({ error: 'This username is already registered' });
        };

        // Validate email
        if(!user.email || user.email.length < 5 || !user.email.includes('@') || !user.email.includes('.')) {
            return res.status(400).json({ error: "Invalid email" });
        };

        const emailAlreadyRegistered = await UserModel.find({ email: user.email })
        if(emailAlreadyRegistered && emailAlreadyRegistered.length > 0) {
            return res.status(400).json({ error: 'This email is already registered' });
        };

        // Validate password
        if(!user.password) {
            return res.status(400).json({ error: "Invalid password" });
        };

        // Send Multer image to Cosmic
        const image = await cosmicImageUpload(req); 

        // Save data
        const UserData = {
            name: user.name,
            email: user.email,
            password: md5(user.password),
            avatar: image.media.url,
        };

        await UserModel.create(UserData);
        console.log(`New user: ${UserData.name} (${UserData.email})`);
        return res.status(200).json({ message: "User successfully registered" });
    });

export const config = { api: { bodyParser: false }};

export default mongoDbConnect(handler);
