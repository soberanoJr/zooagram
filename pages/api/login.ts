import type { NextApiRequest, NextApiResponse } from 'next'
import { mongoDbConnect } from '../../middlewares/mongoDbConnect'
import { messagePatterns } from '../../types/messagePatterns'

const loginEndpoint =(
    req: NextApiRequest,
    res: NextApiResponse<messagePatterns>
) => {
    if(req.method === 'POST') {
        const { login, password } = req.body

        if(login === 'admin' && password === 'admin') {
            return res.status(200).json({ message: "User Successfully Connected (200)" })
        }
        return res.status(400).json({ error: "Bad request (400)" })
    }
    return res.status(405).json({ error: "Method not allowed (405)" })
}

export default mongoDbConnect(loginEndpoint)
