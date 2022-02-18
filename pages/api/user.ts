import type { NextApiRequest, NextApiResponse } from 'next'
import { jwtTokenValidation } from '../../middlewares/jwtTokenValidation'

const userEndpoint = (req: NextApiRequest, res: NextApiResponse) => {
    return res.status(200).json({ message: "Connected" })
}

export default jwtTokenValidation(userEndpoint)
