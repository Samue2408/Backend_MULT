import e, { Request, Response} from "express";
import connection from "../db/connection";

export const getItems = async (req: Request, res: Response) => {

    connection.query(`
        SELECT 
            it.item_id,
            it.name,
            ty.name as type_activity_name,
            least_one
        FROM items it
        INNER JOIN type_activities ty ON ty.type_activity_id = it.type_activity_id;
    `, [], (error, data) => {
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


        res.json(data.rows);
    });    

}

export const getItem = async (req: Request, res: Response) => {
    const { id } = req.params;

    connection.query(`
        SELECT 
            it.item_id,
            it.name,
            ty.name as type_activity_name,
            least_one
        FROM items it
        INNER JOIN type_activities ty ON ty.type_activity_id = it.type_activity_id
        WHERE it.item_id = $1;
    `, [Number(id)], (error, data) => {
        if (error) {
            console.error("Error database details: " + (error as any).message);
            return res.status(500).json({
                msg: "Error database details"
            })
        }

        if(data.rows.length === 0) {
            return res.status(404).json({
                msg: "invalid data"
            });
        }

        res.json(data.rows);
    });
}

export const postItem = async (req: Request, res: Response): Promise<any> => {

    try {

        const { name, type_activity_id, least_one } = req.body;

        if (!name || !type_activity_id || !least_one) {
            return res.status(400).json({
                msg: "The data failed is requerid"
            });
        }

        const existItem = await connection.query(`
            SELECT name 
            FROM items 
            WHERE name = $1`, [name]);
        
            if (existItem.rows.length > 0 ) {
                return res.status(400).json({
                    msg: "The item already exist"
                });
            }

        connection.query(`
            INSERT INTO items (name, type_activity_id, least_one)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [name, type_activity_id, least_one], (error, data) => {
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
                msg: "items succesfully created",
                body: data.rows
            });
        });
    }
    catch(e) {
        console.error("Error database details: " + (e as any).message);
        return res.status(500).json({
            msg: "Error creating items",
            error: e
        });
    }
}

export const putItem = async (req: Request, res: Response): Promise<any> => {

    try {
        const { id } = req.params;
        const { name, type_activity_id, least_one } = req.body;

        if (!name || !type_activity_id || !least_one) {
            return res.status(400).json({
                msg: "The data failed is requerid"
            });
        }

        connection.query(`
            UPDATE items 
            SET name = $1, type_activity_id = $2, least_one = $3
            WHERE item_id = $4
            RETURNING *;
        `, [name, type_activity_id, least_one, Number(id)], (error, data) => {
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
                msg: "items succesfully updated",
                body: data.rows
            });
        });
    } catch (e) {
        console.error("Error database details: " + (e as any).message);
        return res.status(500).json({
            msg: "Error updating item",
            error: e
        });
        
    }
    
}

export const deleteItem = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        connection.query(`
            DELETE FROM items
            WHERE item_id = $1
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
                msg: "items succesfully deleted",
                body: data.rows
            });
        });
    } catch (e) {
        console.error("Error database details: " + (e as any).message);
        return res.status(500).json({
            msg: "Error deleting item",
            error: e
        });
    }
}