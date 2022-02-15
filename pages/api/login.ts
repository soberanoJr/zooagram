import type { NextApiRequest, NextApiResponse } from 'next'

export default (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if(req.method === 'POST') {
        const { login, password } = req.body

        if(login === 'admin' && password === 'admin') {
            res.status(200).json( {message: 'OK'} )
        }
        return res.status(400).json( {error: 'Bad request'} )
    }
    return res.status(405).json( {error: 'Method not allowed'} )
}