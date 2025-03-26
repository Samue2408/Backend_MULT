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
exports.deleteWorkPlanItem = exports.putWorkPlanItem = exports.postWorkPlanItem = exports.getWorkPlanItem = exports.getWorkPlansItems = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getWorkPlansItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    connection_1.default.query(`
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
            console.error("Error database details: " + error.message);
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
});
exports.getWorkPlansItems = getWorkPlansItems;
const getWorkPlanItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { item_id, work_plan_id } = req.params;
    if (!item_id || !work_plan_id) {
        return res.status(400).json({
            error: 'item_id or work_plan_id parameters are missing'
        });
    }
    yield connection_1.default.query(`
        SELECT 
            i.name as item_name,
            wpi.work_plan_id,
            wpi.observations,
            wpi.hours,
            wpi.checker
        FROM work_plans_items wpi
        INNER JOIN items i ON i.item_id = wpi.item_id
        WHERE (wpi.item_id = $1 AND wpi.work_plan_id = $2);`, [Number(item_id), Number(work_plan_id)], (error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
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
});
exports.getWorkPlanItem = getWorkPlanItem;
const postWorkPlanItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item_id, work_plan_id, observations, hours, checker } = req.body;
        if (!item_id || !work_plan_id || !observations || !hours || !checker) {
            return res.status(400).json({
                error: 'item_id, work_plan_id, observations, hours or checker parameters are missing'
            });
        }
        yield connection_1.default.query(`
            INSERT INTO work_plans_items (item_id, work_plan_id, observations, hours, checker)
            VALUES ($1, $2, $3, $4, $5);
        `, [item_id, work_plan_id, observations, hours, checker], (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: "Error database details"
                });
            }
            res.status(201).json({
                msg: "work_plans_items created successfully"
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
exports.postWorkPlanItem = postWorkPlanItem;
const putWorkPlanItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item_id, work_plan_id, observations, hours, checker } = req.body;
        if (!observations || !hours || !checker) {
            return res.status(400).json({
                error: 'item_id, work_plan_id, observations, hours or checker parameters are missing'
            });
        }
        yield connection_1.default.query(`
            UPDATE work_plans_items
            SET observations = $1, hours = $2, checker = $3
            WHERE item_id = $4 AND work_plan_id = $5;
        `, [observations, hours, checker, item_id, work_plan_id], (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: "Error database details"
                });
            }
            res.status(201).json({
                msg: "work_plans_items updated successfully"
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
exports.putWorkPlanItem = putWorkPlanItem;
const deleteWorkPlanItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item_id, work_plan_id } = req.params;
        if (!item_id || !work_plan_id) {
            return res.status(400).json({
                error: 'item_id or work_plan_id parameters are missing'
            });
        }
        yield connection_1.default.query(`
            DELETE FROM work_plans_items
            WHERE item_id = $1 AND work_plan_id = $2;
        `, [item_id, work_plan_id], (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: "Error database details"
                });
            }
            res.status(201).json({
                msg: "work_plans_items deleted successfully"
            });
        });
    }
    catch (error) {
        console.error("error database detail: " + error.message);
        return res.status(400).json({
            msg: "error database detail:"
        });
    }
});
exports.deleteWorkPlanItem = deleteWorkPlanItem;
