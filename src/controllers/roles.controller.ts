import { Request, Response} from "express";
import connection from "../db/connection";

export const getRoles = async (req: Request, res: Response) => {

    connection.query(`
        SELECT 
            r.role_id AS rol_id,
            r.name AS rol_nombre
        FROM roles r
    `, [], (error, data) => {
    if (error) console.error("Error database details: " + (error as any).message);
        res.json(data.rows);
    });    

}



