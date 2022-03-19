import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import type {MessagePatterns} from '../types/MessagePatterns';
import NextCors from 'nextjs-cors';

export const corsHandler = (handler : NextApiHandler) =>
    async (req : NextApiRequest, res : NextApiResponse<MessagePatterns>) => {
    try{
        await NextCors(req, res, {
            origin : '*',
            methods : ['GET', 'POST', 'PUT'],
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        });

        return handler(req, res);
    }catch(e){
        console
            .log('Error handling with CORS', e);
        return res
            .status(500)
            .json({error : 'Error handling with CORS'});
    }
}
