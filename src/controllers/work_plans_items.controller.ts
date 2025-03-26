import { Response, Request } from "express";
import connetion from "../db/connection";

export const getWorkPlansItems = async (req: Request, res: Response) => {

    connetion.query(`
        SELECT 
            i.name as item_name,
            wpi.work_plan_id,
            wpi.observations,
            wpi.hours,
            wpi.checker
        FROM work_plans_items wpi
        INNER JOIN items i ON i.item_id = wpi.item_id;
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

        res.status(200).json(data.rows);
    });
}

export const getWorkPlanItem = async (req: Request, res: Response): Promise<any> => {
    const {item_id, work_plan_id } = req.params;

    if (!item_id || !work_plan_id) {
        return res.status(400).json({ 
            error: 'item_id or work_plan_id parameters are missing'
        });
    }

    await connetion.query(`
        SELECT 
            i.name as item_name,
            wpi.work_plan_id,
            wpi.observations,
            wpi.hours,
            wpi.checker
        FROM work_plans_items wpi
        INNER JOIN items i ON i.item_id = wpi.item_id
        WHERE (wpi.item_id = $1 AND wpi.work_plan_id = $2);`
        , [Number(item_id), Number(work_plan_id) ], (error, data) => {
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

        res.status(200).json(data.rows);
    });
}

export const postWorkPlanItem = async (req: Request, res: Response): Promise<any> => {
    try {
        const { item_id, work_plan_id, observations, hours, checker } = req.body;

        if (!item_id || !work_plan_id || !observations || !hours || !checker) {
            return res.status(400).json({
                error: 'item_id, work_plan_id, observations, hours or checker parameters are missing'
            });
        }

        await connetion.query(`
            INSERT INTO work_plans_items (item_id, work_plan_id, observations, hours, checker)
            VALUES ($1, $2, $3, $4, $5);
        `, [item_id, work_plan_id, observations, hours, checker], (error, data) => {
            if (error) {
                console.error("Error database details: " + (error as any).message);
                return res.status(500).json({
                    msg: "Error database details"
                });
            }

            res.status(201).json({
                msg: "work_plans_items created successfully"
            });
        });
    } catch (error) {
        console.error("Error database details: " + (error as any).message);
        return res.status(500).json({
            msg: "Error database details"
        });
    }
}

export const putWorkPlanItem = async (req: Request, res: Response): Promise<any> => {
    try {
        const { item_id, work_plan_id, observations, hours, checker } = req.body;

        if (!observations || !hours || !checker) {
            return res.status(400).json({
                error: 'item_id, work_plan_id, observations, hours or checker parameters are missing'
            });
        }

        await connetion.query(`
            UPDATE work_plans_items
            SET observations = $1, hours = $2, checker = $3
            WHERE item_id = $4 AND work_plan_id = $5;
        `, [observations, hours, checker, item_id, work_plan_id], (error, data) => {
            if (error) {
                console.error("Error database details: " + (error as any).message);
                return res.status(500).json({
                    msg: "Error database details"
                });
            }

            res.status(201).json({
                msg: "work_plans_items updated successfully"
            });
        });
    } catch (error) {
        console.error("Error database details: " + (error as any).message);
        return res.status(500).json({
            msg: "Error database details"
        });
    }
}

export const deleteWorkPlanItem = async (req: Request, res: Response): Promise<any> => {
    try {
        const { item_id, work_plan_id } = req.params;

        if (!item_id || !work_plan_id) {
            return res.status(400).json({
                error: 'item_id or work_plan_id parameters are missing'
            });
        }

        await connetion.query(`
            DELETE FROM work_plans_items
            WHERE item_id = $1 AND work_plan_id = $2;
        `, [item_id, work_plan_id], (error, data) => {
            if (error) {
                console.error("Error database details: " + (error as any).message);
                return res.status(500).json({
                    msg: "Error database details"
                });
            }

            res.status(201).json({
                msg: "work_plans_items deleted successfully"
            });
        });     
    } catch (error){
        console.error("error database detail: " + (error as any).message);
        return res.status(400).json({
            msg: "error database detail:"
        });
    }
}