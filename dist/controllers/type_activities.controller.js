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
exports.deleteFaculty = exports.putTypeActivity = exports.postTypeActivity = exports.getTypeActivity = exports.getTypeActivities = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getTypeActivities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection_1.default.query(`
        SELECT type_activity_id, name
        FROM type_activities;`, [], (error, data) => {
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
        res.json(data.rows);
    });
});
exports.getTypeActivities = getTypeActivities;
const getTypeActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield connection_1.default.query(`
        SELECT type_activity_id, name
        FROM type_activities
        WHERE type_activity_id = $1;
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
        res.json(data.rows);
    });
});
exports.getTypeActivity = getTypeActivity;
const postTypeActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                msg: "The name failed is requerid"
            });
        }
        const existTypeA = yield connection_1.default.query(`
            SELECT name 
            FROM type_activities
            WHERE name = $1;`, [name]);
        if (existTypeA.rows.length > 0) {
            return res.status(400).json({
                msg: "Type activity already exist"
            });
        }
        yield connection_1.default.query(`
            INSERT INTO type_activities (name) 
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
                msg: "Type activity succesfully created",
                body: data.rows
            });
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "Error creating Type activity"
        });
    }
});
exports.postTypeActivity = postTypeActivity;
const putTypeActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                msg: "The name failed is requerid"
            });
        }
        const existTypeA = yield connection_1.default.query(`
            SELECT * 
            FROM type_activities
            WHERE type_activity_id = $1;`, [Number(id)]);
        if (existTypeA.rows.length === 0) {
            return res.status(404).json({
                msg: "No information found with the provided id"
            });
        }
        yield connection_1.default.query(` 
            UPDATE type_activities
            SET name = $1
            WHERE type_activity_id = $2
            RETURNING *;`, [name, Number(id)], (error, data) => {
            if (error) {
                console.error("Error database detail: " + error.message);
                return res.status(500).json({
                    msg: 'Error database detail'
                });
            }
            if (data.rows.length === 0) {
                return res.status(400).json({
                    msg: "Invalid data"
                });
            }
            ;
            res.json({
                msg: "Type activity succesfully updated",
            });
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "Error updating Type activity",
            error: e
        });
    }
});
exports.putTypeActivity = putTypeActivity;
const deleteFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield connection_1.default.query(`
            DELETE FROM type_activities 
            WHERE type_activity_id = $1 
            RETURNING *;`, [Number(id)], (error, data) => {
            if (error) {
                console.error("Error data");
                return res.status(400).json({
                    msg: error.message
                });
            }
            if (data.rows.length === 0) {
                return res.status(400).json({
                    msg: "Type activity not found"
                });
            }
            ;
            res.json({
                msg: "successfull Type activity delete",
                deleted_user: data.rows
            });
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "Error delete Type activity",
            error: e
        });
    }
});
exports.deleteFaculty = deleteFaculty;
