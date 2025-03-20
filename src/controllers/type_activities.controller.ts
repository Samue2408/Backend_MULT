import { Request, Response } from "express";
import connection from "../db/connection";

export const getTypeActivities = async (req: Request, res: Response) => {

    await connection.query(`
        SELECT type_activity_id, name
        FROM type_activities;`,
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

export const getTypeActivity = async (req: Request, res: Response) => {
    
    const {id} = req.params;

    await connection.query(`
        SELECT type_activity_id, name
        FROM type_activities
        WHERE type_activity_id = $1;
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

export const postTypeActivity = async (req: Request, res: Response): Promise<any> => {
    
    try {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({
                msg: "The name failed is requerid"
            });
        }

        const existTypeA = await connection.query(`
            SELECT name 
            FROM type_activities
            WHERE name = $1;`, [name]
        );

        if (existTypeA.rows.length > 0) {
            return res.status(400).json({
                msg: "Type activity already exist"
            });
        }
        await connection.query(`
            INSERT INTO type_activities (name) 
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
                    msg: "Type activity succesfully created",
                    body: data.rows
                });
            });
        
    } catch (e) {
        res.status(500).json({
            msg: "Error creating Type activity"
        });
    }
}

export const putTypeActivity = async (req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params;
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({
                msg: "The name failed is requerid"
            });
        }    

        const existTypeA = await connection.query(`
            SELECT * 
            FROM type_activities
            WHERE type_activity_id = $1;`, [Number(id)]);

        if (existTypeA.rows.length === 0){
            return res.status(404).json({
                msg: "No information found with the provided id"
            });
        }

        await connection.query(` 
            UPDATE type_activities
            SET name = $1
            WHERE type_activity_id = $2
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
                    msg: "Type activity succesfully updated",
                });
            });
    } catch (e) {
        res.status(500).json({
            msg: "Error updating Type activity",
            error: e
        });
    }
}

export const deleteFaculty = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        await connection.query(`
            DELETE FROM type_activities 
            WHERE type_activity_id = $1 
            RETURNING *;`, [Number(id)], (error, data) =>{
                if (error) {
                    console.error("Error data");
                    return res.status(400).json({
                        msg: error.message
                    });
                }

                if(data.rows.length === 0) {
                    return res.status(400).json({
                        msg: "Type activity not found"
                    });
                };
                
                res.json({
                    msg: "successfull Type activity delete",
                    deleted_user: data.rows
                })
            });
    } catch (e) {
        res.status(500).json({
            msg: "Error delete Type activity",
            error: e
        });
    }
}