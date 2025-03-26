import { Response, Request, query } from "express";
import connection from "../db/connection";

export const getWorkingDays = async (req: Request, res: Response) => {

    connection.query(`
        SELECT 
            wd.working_day_id AS working_day_id,
            wd.name AS working_day_name
        FROM working_days wd;
    `, [], (error, data) => {
        if (error) console.error("Error database details: " + (error as any).message);
        res.json(data.rows);
    });

}

export const getWorkingDay = async (req:Request, res:Response): Promise<any> => {
    
    const {id} = req.params;

    const exitWorkDay = await connection.query(`
        SELECT * 
        FROM working_days
        WHERE working_day_id = $1;`, [Number(id)]);

    if (exitWorkDay.rows.length === 0){
        return res.status(404).json({
            msg: "No se ha encontrado id"
        });
    }

    await connection.query(` 
        SELECT
            wk.working_day_id,
            wk.name
        FROM working_days wk
        WHERE wk.working_day_id = $1;`, 
        [Number(id)], (error, data) => {
            if (error) console.error("Error database detail: " + (error as any).message);
            res.json(data.rows);

            if (data.rows.length === 0 ) {
                return res.status(404).json({
                    msg: "Working dat no found"
                });
            }

            res.json(data.rows);
        });

}

export const postWorkingDay = async (req: Request, res: Response): Promise<any> => {
    
    try {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({
                msg: "The name failed is requerid"
            });
        }

        const workDayExist = await connection.query(`
            SELECT name 
            FROM working_days
            WHERE name = $1`, [name]
        );

        if (workDayExist.rows.length > 0) {
            return res.status(400).json({
                msg: "Working Day already exist"
            });
        }

        await connection.query(`
            INSERT INTO working_days (name) 
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
                    msg: "Working day succesfully created",
                    body: data.rows
                });
            });
        
    } catch (e) {
        res.status(500).json({
            msg: "Error creating working day"
        });
    }
            
}

export const putWorkingDay = async (req:Request, res:Response): Promise<any> => {
    
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
            FROM working_days
            WHERE working_day_id = $1;`, [Number(id)]);

        if (exitWorkDay.rows.length === 0){
            return res.status(404).json({
                msg: "No information found with the provided id"
            });
        }

        await connection.query(` 
            UPDATE working_days
            SET name = $1
            WHERE working_day_id = $2
            RETURNING *;`, 
            [name, Number(id)], (error, data) => {
                if (error) {
                    console.error("Error database detail: " + (error as any).message);
                    return res.status(500).json({
                        msg: 'Error en el servidor'
                    });
                }

                if(data.rows.length === 0) {
                    return res.status(400).json({
                        msg: "Invalid data"
                    });
                };

                res.json({
                    msg: "Working day succesfully updated",
                });
            });
    } catch (e) {
        res.status(500).json({
            msg: "Error updating Working day",
            error: e
        });
    }
    
}

export const deletedWorkingDay = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        await connection.query(`
            DELETE FROM working_days 
            WHERE working_day_id = $1 
            RETURNING *;`, [Number(id)], (error, data) =>{
                if (error) {
                    console.error("Error data");
                    return res.status(400).json({
                        msg: error.message
                    });
                }

                if(data.rows.length === 0) {
                    return res.status(400).json({
                        msg: "working days not found"
                    });
                };
                
                res.json({
                    msg: "successfull working days delete",
                    deleted_user: data.rows
                })
            });
    } catch (e) {
        res.status(500).json({
            msg: "Error delete Working day",
            error: e
        });
    }
}