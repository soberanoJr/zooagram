import type { NextApiRequest, NextApiResponse, NextApiHandler } from'next'
import mongoose from 'mongoose'
import { MessagePatterns } from '../types/MessagePatterns'

export const mongoDbConnect = (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<MessagePatterns>) => {
        // follow endpoint or next middleware if database is connected
        if(mongoose.connections[0].readyState) {
            return handler(req, res)
        }
        // connect to database instead
        const { DB_CONNECTION_STRING } = process.env;

        // .env error
        if(!DB_CONNECTION_STRING) {
            return res.status(500).json({ error: "internal server error" })
        }
        
        mongoose.connection.on('connected', () => console.log('Database successfully connected.'))
        mongoose.connection.on('error', error => console.log(`Error: ${error}`))
        await mongoose.connect(DB_CONNECTION_STRING)
        return handler(req, res)
    }
