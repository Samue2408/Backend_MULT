"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkPlan = exports.putWorkPlan = exports.postWorkPlan = exports.getWorkPlan = exports.getWorkPlans = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getWorkPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    connection_1.default.query(`
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
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: "Error database details"
            });
        }
        if (data.rows.length === 0) {
            console.error("invalid data: " + error.message);
            return res.json({
                msg: "invalid data"
            });
        }
        res.status(200).json(data.rows);
    });
});
exports.getWorkPlans = getWorkPlans;
const getWorkPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield connection_1.default.query(`
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
            console.error("Error database details: " + error.message);
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
});
exports.getWorkPlan = getWorkPlan;
const postWorkPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { semester, total_hours, year, qualification, teaching_id } = req.body;
        if (!semester || !total_hours || !year || !qualification || !teaching_id) {
            return res.status(400).json({
                msg: "The data failed is requerid"
            });
        }
        yield connection_1.default.query(`
            INSERT INTO work_plans (semester, total_hours, year, qualification, teaching_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;`, [semester, total_hours, year, qualification, teaching_id], (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
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
    }
    catch (error) {
        console.error("Error database details: " + error.message);
        return res.status(500).json({
            msg: "Error database details"
        });
    }
});
exports.postWorkPlan = postWorkPlan;
const putWorkPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { semester, total_hours, year, qualification, teaching_id } = req.body;
        if (!semester || !total_hours || !year || !qualification || !teaching_id) {
            return res.status(400).json({
                msg: "The data failed is requerid"
            });
        }
        const workPlanExit = yield connection_1.default.query(`
            SELECT * 
            FROM work_plans
            WHERE work_plan_id = $1;`, [Number(id)]);
        if (workPlanExit.rows.length === 0) {
            return res.status(404).json({
                msg: "No information found with the provided id"
            });
        }
        yield connection_1.default.query(`
            UPDATE work_plans
            SET semester = $1, total_hours = $2, year = $3, qualification = $4, teaching_id = $5
            WHERE work_plan_id = $6
            RETURNING *;`, [semester, total_hours, year, qualification, teaching_id, Number(id)], (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
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
    }
    catch (error) {
        console.error("Error database details: " + error.message);
        return res.status(500).json({
            msg: "Error database details"
        });
    }
});
exports.putWorkPlan = putWorkPlan;
const deleteWorkPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield connection_1.default.query(`
            DELETE FROM work_plans
            WHERE work_plan_id = $1
            RETURNING *;`, [Number(id)], (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
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
    }
    catch (error) {
        console.error("Error database details: " + error.message);
        return res.status(500).json({
            msg: "Error database details"
        });
    }
});
exports.deleteWorkPlan = deleteWorkPlan;
