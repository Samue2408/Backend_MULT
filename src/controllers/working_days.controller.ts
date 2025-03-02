import { Response, Request } from "express";
import connection from "../db/connection";

export const getWorkingDays = async (req: Request, res: Response) => {

    connection.query(`
        SELECT 
            wd.working_day_id AS working_day_id,
            wd.name AS working_day_name
        FROM working_days wd
    `, [], (error, data) => {
        if (error) console.error("Error database details: " + (error as any).message);
        res.json(data.rows);
    });

}