import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import type { MessagePatterns } from '../types/MessagePatterns'

export const jwtTokenValidation = (handler: NextApiHandler) =>
    (req: NextApiRequest, res: NextApiResponse<MessagePatterns>) => {
        try {
            const { JWT_KEY } = process.env
    
            if(!JWT_KEY) {
                res.status(500).json({ error: "Missing JWT Key" })
            }

            if(!req || !req.headers) {
                res.status(401).json({ error: "Missing headers" })
            }

            if(req.method !== 'OPTIONS') {
                const authorization = req.headers['authorization']
                if(!authorization) {
                    res.status(401).json({ error: "Not authorized" })
                }

                const token = authorization.substring(7)
                if(!token) {
                    res.status(401).json({ error: "Token not found" })
                }

                const decoded = jwt.verify(token, JWT_KEY) as JwtPayload
                if(!decoded) {
                    res.status(401).json({ error: "Token not validated" })
                }

                if(req.query) {
                    req.query = {}
                }

                req.query.userId = decoded._id
            }
        } catch(e) {
            console.log(e)
            return res.status(401).json({ error: "Token not validated" })
        }

        return handler(req, res)
    }
