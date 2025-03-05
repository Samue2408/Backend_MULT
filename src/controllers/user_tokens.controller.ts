import jwt, { SignOptions } from 'jsonwebtoken';
import { Request, Response } from 'express';
import connection from '../db/connection';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export const generateTokens = async (req: Request, res: Response) => {

    const token = req.headers.authorization?.split(' ')[1];

    if(token) {
        await deleteRefreshToken(token);
    }

    try {
        const { user_id } = req.body;

        const access_token = await generateAccessToken(user_id);
        const refresh_token = await generateRefreshToken(user_id); 

        

        connection.query(`
            INSERT INTO refresh_tokens (user_id, token, created_at)
            VALUES ($1, $2, NOW());
        `, [user_id, refresh_token], (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: error.message
                })  
            };



            res.json({
                msg: "Sign in successfully",
                access_token,
                refresh_token,
                user_id
            });
        });        
        
    } catch (error) {
        console.error("Error generate token: " + (error as any).message);   
    }
}

const generateAccessToken = async (user_id: number) => {
    return await jwt.sign({ userId: user_id }, JWT_SECRET, { expiresIn: '1h' } as SignOptions);
}

const generateRefreshToken = async (user_id: number) => {
    return await jwt.sign({ userId: user_id }, JWT_SECRET, { expiresIn: '7d' } as SignOptions);
}

const deleteRefreshToken = async (token: string) => {
    await connection.query('DELETE FROM refresh_tokens WHERE token = $1', [token], (error, data) => {
        if (error) console.error("Error database details: " + error.message);
        console.log(data)
    });
}

export const refreshAccessToken = async (req: Request, res: Response): Promise<any> => {

    const token = req.headers.authorization?.split(' ')[1];

    if(!token) {
        return res.status(401).json({
            msg: "Token not found"
        });
    }

    const result = await connection.query('SELECT * FROM refresh_tokens WHERE token = $1', [token]);

    if(result.rows.length === 0) {
        return res.status(403).json({
            msg: "Invalid Refresh Token"
        });
    }

    const { user_id } = result.rows[0];

    res.json({
        access_token: await generateAccessToken(user_id)
    });

}

export const findRefreshToken = async (req: Request, res: Response) => {

    const { user_id } = res.locals.user;

    connection.query('SELECT * FROM refresh_tokens WHERE user_id = $1', [user_id], (error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: error.message
            })
        }

        if(data.rows.length === 0) {
            return res.json({
                active_session: false,
                msg: "Without active session"
            });
        }   

        res.json({
            active_session: true,
            msg: "You have an active session",
            data: data.rows
        });
    });

}