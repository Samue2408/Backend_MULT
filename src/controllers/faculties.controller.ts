import { Request, Response } from "express";
import connection from "../db/connection";

export const getFaculties = async (req: Request, res: Response) => {

    await connection.query(`
        SELECT faculty_id, name
        FROM faculties;`,
    [], (error, data) => {
        
        if (error) {
            console.error("Error database details: " + (error as any).message);
            return res.status(500).json({
                msg: "Error database details: "
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

export const getFaculty = async (req: Request, res: Response) => {
    
    const {id} = req.params;

    await connection.query(`
        SELECT faculty_id, name
        FROM faculties
        WHERE faculty_id = $1;
        `, [Number(id)], (error, data) => {
            if (error) {
                console.error("Error database details: " + (error as any).message);
                return res.status(500).json({
                    msg: "Error database details: "
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

export const postFaculty = async (req: Request, res: Response): Promise<any> => {
    
    try {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({
                msg: "The name failed is requerid"
            });
        }

        const existWorkDay = await connection.query(`
            SELECT name 
            FROM faculties
            WHERE name = $1;`, [name]
        );

        if (existWorkDay.rows.length > 0) {
            return res.status(400).json({
                msg: "Faculties already exist"
            });
        }
        await connection.query(`
            INSERT INTO faculties (name) 
            VALUES ($1)
            RETURNING *;`, 
            [name], (error, data) => {
                if (error) {
                    console.error("Error database detail: " + error.message);
                    return res.status(500).json({
                        msg: "Error database detail: " +error.message
                    });
                }

                if (data.rows.length === 0){
                    return res.status(400).json({
                        msg: "Data invalid"
                    });
                }

                res.status(201).json({
                    msg: "Faculties succesfully created",
                    body: data.rows
                });
            });
        
    } catch (e) {
        res.status(500).json({
            msg: "Error creating Faculties"
        });
    }
}

export const putFaculty = async (req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params;
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({
                msg: "The name failed is requerid"
            });
        }    

        const exitWorkDay = await connection.query(`
            SELECT * 
            FROM faculties
            WHERE faculty_id = $1;`, [Number(id)]);

        if (exitWorkDay.rows.length === 0){
            return res.status(404).json({
                msg: "No information found with the provided id"
            });
        }

        await connection.query(` 
            UPDATE faculties
            SET name = $1
            WHERE faculty_id = $2
            RETURNING *;`, 
            [name, Number(id)], (error, data) => {
                if (error) {
                    console.error("Error database detail: " + (error as any).message);
                    return res.status(500).json({
                        msg: 'Error database detail'
                    });
                }

                if(data.rows.length === 0) {
                    return res.status(400).json({
                        msg: "Invalid data"
                    });
                };

                res.json({
                    msg: "Faculty succesfully updated",
                });
            });
    } catch (e) {
        res.status(500).json({
            msg: "Error updating Faculty",
            error: e
        });
    }
}

export const deleteFaculty = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        await connection.query(`
            DELETE FROM faculties 
            WHERE faculty_id = $1 
            RETURNING *;`, [Number(id)], (error, data) =>{
                if (error) {
                    console.error("Error data");
                    return res.status(400).json({
                        msg: error.message
                    });
                }

                if(data.rows.length === 0) {
                    return res.status(400).json({
                        msg: "Faculty not found"
                    });
                };
                
                res.json({
                    msg: "successfull Faculty delete",
                    deleted_user: data.rows
                })
            });
    } catch (e) {
        res.status(500).json({
            msg: "Error delete Faculty",
            error: e
        });
    }
}