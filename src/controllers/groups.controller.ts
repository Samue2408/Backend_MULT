import { Request, Response } from "express";
import connection from "../db/connection";

export const getGroups = async (req: Request, res: Response) => {

    await connection.query(`
        SELECT group_id, name
        FROM groups;`,
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

export const getGroup = async (req: Request, res: Response) => {
    
    const {id} = req.params;

    await connection.query(`
        SELECT group_id, name
        FROM groups
        WHERE group_id = $1;
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

export const postGroup = async (req: Request, res: Response): Promise<any> => {
    
    try {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({
                msg: "The name failed is requerid"
            });
        }

        const existGroup = await connection.query(`
            SELECT name 
            FROM groups
            WHERE name = $1;`, [name]
        );

        if (existGroup.rows.length > 0) {
            return res.status(400).json({
                msg: "Groups already exist"
            });
        }
        await connection.query(`
            INSERT INTO groups (name) 
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
                    msg: "Groups succesfully created",
                    body: data.rows
                });
            });
        
    } catch (e) {
        res.status(500).json({
            msg: "Error creating Groups"
        });
    }
}

export const putGroup = async (req: Request, res: Response): Promise<any> => {
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
            FROM groups
            WHERE group_id = $1;`, [Number(id)]);

        if (exitWorkDay.rows.length === 0){
            return res.status(404).json({
                msg: "No information found with the provided id"
            });
        }

        await connection.query(` 
            UPDATE groups
            SET name = $1
            WHERE group_id = $2
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
                    msg: "Group succesfully updated",
                });
            });
    } catch (e) {
        res.status(500).json({
            msg: "Error updating Group",
            error: e
        });
    }
}

export const deleteGroup = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        await connection.query(`
            DELETE FROM groups 
            WHERE group_id = $1 
            RETURNING *;`, [Number(id)], (error, data) =>{
                if (error) {
                    console.error("Error data");
                    return res.status(400).json({
                        msg: error.message
                    });
                }

                if(data.rows.length === 0) {
                    return res.status(400).json({
                        msg: "Groups not found"
                    });
                };
                
                res.json({
                    msg: "successfull Groups delete",
                    deleted_user: data.rows
                })
            });
    } catch (e) {
        res.status(500).json({
            msg: "Error delete Groups",
            error: e
        });
    }
}