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
exports.deletedWorkingDay = exports.putWorkingDay = exports.postWorkingDay = exports.getWorkingDay = exports.getWorkingDays = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getWorkingDays = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    connection_1.default.query(`
        SELECT 
            wd.working_day_id AS working_day_id,
            wd.name AS working_day_name
        FROM working_days wd;
    `, [], (error, data) => {
        if (error)
            console.error("Error database details: " + error.message);
        res.json(data.rows);
    });
});
exports.getWorkingDays = getWorkingDays;
const getWorkingDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const exitWorkDay = yield connection_1.default.query(`
        SELECT * 
        FROM working_days
        WHERE working_day_id = $1;`, [Number(id)]);
    if (exitWorkDay.rows.length === 0) {
        return res.status(404).json({
            msg: "No se ha encontrado id"
        });
    }
    yield connection_1.default.query(` 
        SELECT
            wk.working_day_id,
            wk.name
        FROM working_days wk
        WHERE wk.working_day_id = $1;`, [Number(id)], (error, data) => {
        if (error)
            console.error("Error database detail: " + error.message);
        res.json(data.rows);
        if (data.rows.length === 0) {
            return res.status(404).json({
                msg: "Working dat no found"
            });
        }
        res.json(data.rows);
    });
});
exports.getWorkingDay = getWorkingDay;
const postWorkingDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                msg: "The name failed is requerid"
            });
        }
        const workDayExist = yield connection_1.default.query(`
            SELECT name 
            FROM working_days
            WHERE name = $1`, [name]);
        if (workDayExist.rows.length > 0) {
            return res.status(400).json({
                msg: "Working Day already exist"
            });
        }
        yield connection_1.default.query(`
            INSERT INTO working_days (name) 
            VALUES ($1)
            RETURNING *;`, [name], (error, data) => {
            if (error) {
                console.error("Error database detail: " + error.message);
                return res.status(500).json({
                    msg: "Error database detail: " + error.message
                });
            }
            if (data.rows.length === 0) {
                return res.status(400).json({
                    msg: "Data invalid"
                });
            }
            res.status(201).json({
                msg: "Working day succesfully created",
                body: data.rows
            });
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "Error creating working day"
        });
    }
});
exports.postWorkingDay = postWorkingDay;
const putWorkingDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                msg: "The name failed is requerid"
            });
        }
        const exitWorkDay = yield connection_1.default.query(`
            SELECT * 
            FROM working_days
            WHERE working_day_id = $1;`, [Number(id)]);
        if (exitWorkDay.rows.length === 0) {
            return res.status(404).json({
                msg: "No information found with the provided id"
            });
        }
        yield connection_1.default.query(` 
            UPDATE working_days
            SET name = $1
            WHERE working_day_id = $2
            RETURNING *;`, [name, Number(id)], (error, data) => {
            if (error) {
                console.error("Error database detail: " + error.message);
                return res.status(500).json({
                    msg: 'Error en el servidor'
                });
            }
            if (data.rows.length === 0) {
                return res.status(400).json({
                    msg: "Invalid data"
                });
            }
            ;
            res.json({
                msg: "Working day succesfully updated",
            });
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "Error updating Working day",
            error: e
        });
    }
});
exports.putWorkingDay = putWorkingDay;
const deletedWorkingDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield connection_1.default.query(`
            DELETE FROM working_days 
            WHERE working_day_id = $1 
            RETURNING *;`, [Number(id)], (error, data) => {
            if (error) {
                console.error("Error data");
                return res.status(400).json({
                    msg: error.message
                });
            }
            if (data.rows.length === 0) {
                return res.status(400).json({
                    msg: "working days not found"
                });
            }
            ;
            res.json({
                msg: "successfull working days delete",
                deleted_user: data.rows
            });
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "Error delete Working day",
            error: e
        });
    }
});
exports.deletedWorkingDay = deletedWorkingDay;
