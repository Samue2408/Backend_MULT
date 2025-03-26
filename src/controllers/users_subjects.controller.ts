
import { Request, Response} from "express";
import connection from "../db/connection";

export const getUsersSubjects = async (req: Request, res: Response) => {
    
    connection.query(`
        SELECT 
            us.user_subject_id,
            u.full_name as user_name,
            s.name as subject_name,
            g.name as group_name,
            us.semester,
            us.year,
            us.period_year
        FROM users_subjects us
        INNER JOIN users u ON u.user_id = us.user_id
        INNER JOIN subjects s ON s.subject_id = us.subject_id
        INNER JOIN groups g ON g.group_id = us.group_id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    `, [], (error, data) => {
        if (error) {
            console.error("Error database details: " + (error as any).message);
            return res.status(500).json({
                msg: "Error database details"
            })
        }

        if (data.rows.length === 0) {
            return res.json({
                msg: "invalid data: no subject found"
            });
        }
        res.json(data.rows);
    });    
}

export const getUserSubject = async (req: Request, res: Response) => {

    const { id } = req.params;
    
    connection.query(`
        SELECT 
            us.user_subject_id,
            u.full_name as user_name,
            s.name as subject_name,
            g.name as group_name,
            us.semester,
            us.year,
            us.period_year
        FROM users_subjects us
        INNER JOIN users u ON u.user_id = us.user_id
        INNER JOIN subjects s ON s.subject_id = us.subject_id
        INNER JOIN groups g ON g.group_id = us.group_id
        WHERE us.user_subject_id = $1;
    `, [Number(id)], (error, data) => {
        if (error) {
            console.error("Error database details: " + (error as any).message);
            return res.status(500).json({
                msg: "Error database details"
            })
        }

        if (data.rows.length === 0) {
            console.error("Invalid data: " + (error as any).message);
            return res.json({
                msg: "invalid data: no subject found"
            });
        }
        res.json(data.rows);
    });    
}

export const postUserSubject = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const {user_id, subject_id, group_id, semester, year, period_year} = req.body;

        await connection.query(`
            INSERT INTO users_subjects (user_id, subject_id, group_id, semester, year, period_year)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [user_id, subject_id, group_id, semester, year, period_year], (error, data) => {
            if (error) {
                console.error("Error database details: " + (error as any).message);
                return res.status(500).json({
                    msg: "Error database details"
                })
            }

            if (data.rows.length === 0) {
                return res.json({
                    msg: "invalid data"
                });
            }

            return res.status(201).json({
                msg: "User subject created"
            });
        });
    } catch (error) {
        console.error("Error database details: " + (error as any).message);
        return res.status(500).json({
            msg: "Error database details"
        })
        
    }    
}

export const putUserSubject = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { user_id, subject_id, group_id, semester, year, period_year } = req.body;

        if (!user_id || !subject_id || !group_id || !semester || !year || !period_year) {
            return res.status(400).json({
                msg: "The user_id, subject_id, group_id, semester, year, period_year field is required"
            });
        }

        await connection.query(`
            UPDATE users_subjects
            SET user_id = $1, subject_id = $2, group_id = $3, semester = $4, year = $5, period_year = $6
            WHERE user_subject_id = $7;
        `, [user_id, subject_id, group_id, semester, year, period_year, Number(id)], (error, data) => {
            if (error) {
                console.error("Error database details: " + (error as any).message);
                return res.status(500).json({
                    msg: "Error database details"
                });
            }

            return res.status(201).json({
                msg: "User subject updated"
            });
        });
    } catch (error) {
        console.error("Error database details: " + (error as any).message);
        return res.status(500).json({
            msg: "Error database details"
        });
        
    }
    
}

export const deleteUserSubject = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        await connection.query(`
            DELETE FROM users_subjects
            WHERE user_subject_id = $1
            RETURNING *;
        `, [Number(id)], (error, data) => {
            if (error) {
                console.error("Error database details: " + (error as any).message);
                return res.status(500).json({
                    msg: "Error database details"
                });
            }

            if (data.rows.length === 0) {
                return res.status(400).json({
                    msg: "Invalid data"
                });
            }

            return res.status(201).json({
                msg: "User subject deleted"
            });
        });
    } catch (error) {
        console.error("Error database details: " + (error as any).message);
        return res.status(500).json({
            msg: "Error database details"
        });
    }
}