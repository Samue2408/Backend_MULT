import { Request, Response } from "express";
import connection from "../db/connection";

export const getWorkPlans = async (req: Request, res: Response) => {
    connection.query(`
        SELECT 
            wp.work_plan_id,
            wp.semester,
            wp.total_hours,
            wp.year,
            wp.qualification,
            u.full_name as teaching_name
        FROM work_plans wp
        INNER JOIN users u ON u.user_id = wp.teaching_id;
    `, [], (error, data) => {
        if (error) {
            console.error("Error database details: " + (error as any).message);
            return res.status(500).json({
                msg: "Error database details"
            });
        }

        if (data.rows.length === 0) {
            console.error("invalid data: " + (error as any).message);
            
            return res.json({
                msg: "invalid data"
            });
        }

        res.status(200).json(data.rows);
    });
}

export const getWorkPlan = async (req: Request, res: Response) => {
    const { id } = req.params;

    await connection.query(`
        SELECT 
            wp.work_plan_id,
            wp.semester,
            wp.total_hours,
            wp.year,
            wp.qualification,
            u.full_name as teaching_name
        FROM work_plans wp
        INNER JOIN users u ON u.user_id = wp.teaching_id
        WHERE wp.work_plan_id = $1;
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

            res.status(200).json(data.rows);
        });
}

export const postWorkPlan = async (req: Request, res: Response): Promise<any> => {
    try {
        const { semester, total_hours, year, qualification, teaching_id } = req.body;

        if (!semester || !total_hours || !year || !qualification || !teaching_id) {
            return res.status(400).json({
                msg: "The data failed is requerid"
            });
        }

        await connection.query(`
            INSERT INTO work_plans (semester, total_hours, year, qualification, teaching_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;`, 
            [semester, total_hours, year, qualification, teaching_id], (error, data) => {
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

                res.status(201).json({
                    msg: "Work plan succesfully created",
                    data: data.rows
                });
            });
        
    } catch (error) {
        console.error("Error database details: " + (error as any).message);
        return res.status(500).json({
            msg: "Error database details"
        });
        
    }
}

export const putWorkPlan = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { semester, total_hours, year, qualification, teaching_id } = req.body;

        if (!semester || !total_hours || !year || !qualification || !teaching_id) {
            return res.status(400).json({
                msg: "The data failed is requerid"
            });
        }

        const workPlanExit = await connection.query(`
            SELECT * 
            FROM work_plans
            WHERE work_plan_id = $1;`, [Number(id)]);

        if (workPlanExit.rows.length === 0) {
            return res.status(404).json({
                msg: "No information found with the provided id"
            });
        }

        await connection.query(`
            UPDATE work_plans
            SET semester = $1, total_hours = $2, year = $3, qualification = $4, teaching_id = $5
            WHERE work_plan_id = $6
            RETURNING *;`, 
            [semester, total_hours, year, qualification, teaching_id, Number(id)], (error, data) => {
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

                res.status(200).json({
                    msg: "Work plan succesfully updated",
                    data: data.rows
                });
            });
        
    } catch (error) {
        console.error("Error database details: " + (error as any).message);
        return res.status(500).json({
            msg: "Error database details"
        });
        
    }
}

export const deleteWorkPlan = async (req: Request, res: Response): Promise<any> => {

    try {
        const { id } = req.params;

        await connection.query(`
            DELETE FROM work_plans
            WHERE work_plan_id = $1
            RETURNING *;`, [Number(id)], (error, data) => {
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

                res.status(200).json({
                    msg: "Work plan succesfully deleted",
                    data: data.rows
                });
            });
    } catch (error) {
        console.error("Error database details: " + (error as any).message);
        return res.status(500).json({
            msg: "Error database details"
        });
        
    }
}