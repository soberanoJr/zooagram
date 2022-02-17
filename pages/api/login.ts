import type { NextApiRequest, NextApiResponse } from 'next'
import md5 from 'md5'
import jwt from 'jsonwebtoken'
import { mongoDbConnect } from '../../middlewares/mongoDbConnect'
import { MessagePatterns } from '../../types/MessagePatterns'
import { LoginResponse } from '../../types/LoginResponse'
import { UserModels } from '../../models/UserModels'

const loginEndpoint = async (
    req: NextApiRequest,
    res: NextApiResponse<MessagePatterns | LoginResponse>
    ) => {
    
    const {JWT_KEY} = process.env
    if(!JWT_KEY) {
        res.status(500).json({ error: "Missing JWT Key" })
    }

    if(req.method === 'POST') {
        const { login, password } = req.body
        const usersFound = await UserModels.find({ email: login, password: md5(password) })

        if(usersFound && usersFound.length > 0) {
            const user = usersFound[0]
            const token = jwt.sign({ _id: user._id}, JWT_KEY)

            console.log(`ID: ${user._id} | Username: ${user.name} | Email: ${user.email} | Status: Connected`)

            return res.status(200).json({ 
                name: user.name,
                email: user.email,
                token,
             })
        }
        return res.status(400).json({ error: "Invalid login and/or password" })
    }
    return res.status(405).json({ error: "This method is not allowed" })
}

export default mongoDbConnect(loginEndpoint)
