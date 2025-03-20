import e, { Request, Response} from "express";
import connection from "../db/connection";

export const getSubjects = async (req: Request, res: Response) => {

    connection.query(`
        SELECT 
            s.subject_id,
            s.name,
            s.hours,
            s.credits,
            f.name as faculty_name
        FROM subjects s
        INNER JOIN faculties f ON f.faculty_id = s.faculty_id;
    `, [], (error, data) => {
        if (error) {
            console.error("Error database details: " + (error as any).message);
            return res.status(500).json({
                msg: "Error database details"
            });
        }

        if (data.rows.length === 0) {
            return res.json({
                msg: "invalid data"
            });
        }


        res.json(data.rows);
    });    

}

export const getSubject = async (req: Request, res: Response) => {
    const { id } = req.params;

    connection.query(`
        SELECT 
            s.subject_id,
            s.name,
            s.hours,
            s.credits,
            f.name as faculty_name
        FROM subjects s
        INNER JOIN faculties f ON f.faculty_id = s.faculty_id;
        WHERE s.subject_id = $1;
    `, [Number(id)], (error, data) => {
        if (error) {
            console.error("Error database details: " + (error as any).message);
            return res.status(500).json({
                msg: "Error database details"
            });
        }

        if(data.rows.length === 0) {
            return res.status(404).json({
                msg: "invalid data"
            });
        }

        res.json(data.rows);
    });
}

export const postSubject = async (req: Request, res: Response): Promise<any> => {

    try {

        const { name, hours, credits, faculty_id } = req.body;

        if (!name || !hours || !credits || !faculty_id) {
            return res.status(400).json({
                msg: "The data failed is requerid"
            });
        }

        const exitSubject = await connection.query(`
            SELECT name 
            FROM subjects 
            WHERE name = $1`, [name]);
        
            if (exitSubject.rows.length > 0 ) {
                return res.status(400).json({
                    msg: "The subject already exist"
                });
            }

        connection.query(`
            INSERT INTO subjects (name, hours, credits, faculty_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [name, hours, credits, faculty_id], (error, data) => {
            if (error) {
                console.error("Error database details: " + (error as any).message);
                return res.status(500).json({
                    msg: "Error database details"
                });
            }

            if(data.rows.length === 0) {
                return res.status(400).json({
                    msg: "Invalid data"
                });
            }

            res.status(201).json({
                msg: "subjects succesfully created",
                body: data.rows
            });
        });
    }
    catch(e) {
        console.error("Error database details: " + (e as any).message);
        return res.status(500).json({
            msg: "Error creating subject",
            error: e
        });
    }
}

export const putSubject = async (req: Request, res: Response): Promise<any> => {

    try {
        const { id } = req.params;
        const { name, hours, credits, faculty_id } = req.body;

        if (!name || !hours || !credits || !faculty_id) {
            return res.status(400).json({
                msg: "The data failed is requerid"
            });
        }

        connection.query(`
            UPDATE subjects
            SET name = $1, hours = $2, credits = $3, faculty_id = $4 
            WHERE subject_id = $5
            RETURNING *;
        `, [name, hours, credits, faculty_id, Number(id)], (error, data) => {
            if (error) {
                console.error("Error database details: " + (error as any).message);
                return res.status(500).json({
                    msg: "Error database details"
                });
            }

            if(data.rows.length === 0) {
                return res.status(400).json({
                    msg: "Invalid data"
                });
            }

            res.json({
                msg: "subject succesfully updated",
                body: data.rows
            });
        });
    } catch (e) {
        console.error("Error database details: " + (e as any).message);
        return res.status(500).json({
            msg: "Error updating subject",
            error: e
        });
        
    }
    
}

export const deleteSubject = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        connection.query(`
            DELETE FROM subjects
            WHERE subject_id = $1
            RETURNING *;
        `, [Number(id)], (error, data) => {
            if (error) {
                console.error("Error database details: " + (error as any).message);
                return res.status(500).json({
                    msg: "Error database details"
                });
            }

            if(data.rows.length === 0) {
                return res.status(400).json({
                    msg: "Invalid data"
                });
            }

            res.json({
                msg: "subject succesfully deleted",
                body: data.rows
            });
        });
    } catch (e) {
        console.error("Error database details: " + (e as any).message);
        return res.status(500).json({
            msg: "Error deleting subject",
            error: e
        });
    }
}