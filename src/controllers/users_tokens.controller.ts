import jwt, { SignOptions } from 'jsonwebtoken';
import { json, Request, Response } from 'express';
import connection from '../db/connection';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export const generateTokens = async (req: Request, res: Response) => {

    const token = req.headers.authorization?.split(' ')[1];

    if(token) {
        await deleteRefreshTokenBD(token);
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

export const deleteRefreshToken = async (req: Request, res: Response): Promise<any> => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token)

    if(!token) {
        return res.status(401).json({
            msg: "Token no povided"
        })
    }
    
    try {
        const isDeleteToken = await deleteRefreshTokenBD(token); 

        console.log("isDeleteToken: " + isDeleteToken);

        if (!isDeleteToken) {
            return res.status(500).json({
                msg: "Token not found"
            });
        }

        return res.json({
            msg: "Successfully logged out"
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Error deleting token"
        });
    }

}

const generateAccessToken = async (user_id: number) => {
    return await jwt.sign({ userId: user_id }, JWT_SECRET, { expiresIn: '1h' } as SignOptions);
}

const generateRefreshToken = async (user_id: number) => {
    return await jwt.sign({ userId: user_id }, JWT_SECRET, { expiresIn: '7d' } as SignOptions);
}

const deleteRefreshTokenBD = async (token: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        connection.query(
            'DELETE FROM refresh_tokens WHERE token = $1 RETURNING *', 
            [token], 
            (error, data) => {
                if (error) {
                    console.error("Error database details: " + error.message);
                    return reject(false); // Rechaza la promesa con false
                } 

                if (data.rowCount === 0) {
                    return resolve(false); // No se eliminó nada
                }

                return resolve(true); // Eliminación exitosa
            }
        );
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

    const user = res.locals.user

    user.password = undefined

    connection.query('SELECT * FROM refresh_tokens WHERE user_id = $1', [user.user_id], (error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: error.message
            })
        }

        if(data.rows.length === 0) {
            return res.json({
                active_session: false,
                msg: "Without active session",
                user
            });
        }   

        res.json({
            active_session: true,
            msg: "You have an active session",
            data: data.rows,
            user
        });
    });

}