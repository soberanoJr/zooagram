import type { NextApiRequest, NextApiResponse } from "next";
import type { MessagePatterns } from "../../types/MessagePatterns";
import { mongoDbConnect } from "../../middlewares/mongoDbConnect";
import { jwtTokenValidation } from "../../middlewares/jwtTokenValidation";
import { UserModel } from "../../models/UserModel";
import { corsHandler } from "../../middlewares/corsHandler";

const searchEndpoint = async (req : NextApiRequest, res: NextApiResponse<MessagePatterns | any[]>) => {
    try {
        if(req.method === 'GET'){
            if(req?.query?.id){
                const user = await UserModel.findById(req?.query?.id);
                if(!user){
                    return res.status(400).json({error : 'User not found.'});
                }
                user.password = null;
                return res.status(200).json(user);
            } else {
                const {q} = req.query;
                console.log(q, req.query)
                if(!q) {
                    return res.status(400).json({ error: `Missing query. (${q})` });
                }
                else if(q.length < 2) {
                    return res.status(400).json({ error: 'Enter more than 2 characters.' });
                }
                const foundUsers = await UserModel.find({ 
                    $or: [
                        { name : { $regex : q, $options : 'i' } }, 
                        { email : { $regex : q, $options : 'i' } } 
                    ]
                });

                foundUsers.forEach(e => e.password = null);
                return res.status(200).json(foundUsers);
            }
        }

        return res.status(405).json({ error: 'Method not allowed.' });
    } catch(e) {
        console.log(e);
        return res.status(500).json({ error: `${e}` });
    }
}

export default corsHandler(jwtTokenValidation(mongoDbConnect(searchEndpoint)));
