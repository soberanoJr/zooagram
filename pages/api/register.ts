import { NextApiRequest, NextApiResponse } from 'next'
import type { MessagePatterns } from '../../types/MessagePatterns'
import type { RegisterRequest } from '../../types/RegisterRequest'
import { UserModels } from '../../models/UserModels'
import { mongoDbConnect } from '../../middlewares/mongoDbConnect'
import md5 from 'md5'

const registerEndpoint = async (
    req: NextApiRequest, 
    res: NextApiResponse<MessagePatterns>
    ) => {
    if(req.method === 'POST') {
        const user = req.body as RegisterRequest

        // Validate username 
        if(!user.name || user.name.length < 2) {
            return res.status(400).json({ error: "Invalid username" })
        }

        const userAlreadyRegistered = await UserModels.find({ name: user.name })
        if(userAlreadyRegistered && userAlreadyRegistered.length > 0) {
            return res.status(400).json({ error: 'This username is already registered' })
        }

        // Validate email
        if(!user.email || user.email.length < 5 || !user.email.includes('@') || !user.email.includes('.')) {
            return res.status(400).json({ error: "Invalid email" })
        }

        const emailAlreadyRegistered = await UserModels.find({ email: user.email })
        if(emailAlreadyRegistered && emailAlreadyRegistered.length > 0) {
            return res.status(400).json({ error: 'This email is already registered' })
        }

        // Validate password
        if(!user.password) {
            return res.status(400).json({ error: "Invalid password" })
        }

        // Save data
        const UserModel = {
            name: user.name,
            email: user.email,
            password: md5(user.password),
        }
        await UserModels.create(UserModel)
        return res.status(200).json({ message: "User successfully registered" })

    }
    return res.status(405).json({ error: "This method is not allowed" })
}

export default mongoDbConnect(registerEndpoint)