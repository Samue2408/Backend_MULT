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
exports.deleteFaculty = exports.putFaculty = exports.postFaculty = exports.getFaculty = exports.getFaculties = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getFaculties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection_1.default.query(`
        SELECT faculty_id, name
        FROM faculties;`, [], (error, data) => {
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
exports.getFaculties = getFaculties;
const getFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield connection_1.default.query(`
        SELECT faculty_id, name
        FROM faculties
        WHERE faculty_id = $1;
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
exports.getFaculty = getFaculty;
const postFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                msg: "The name failed is requerid"
            });
        }
        const existWorkDay = yield connection_1.default.query(`
            SELECT name 
            FROM faculties
            WHERE name = $1;`, [name]);
        if (existWorkDay.rows.length > 0) {
            return res.status(400).json({
                msg: "Faculties already exist"
            });
        }
        yield connection_1.default.query(`
            INSERT INTO faculties (name) 
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
                msg: "Faculties succesfully created",
                body: data.rows
            });
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "Error creating Faculties"
        });
    }
});
exports.postFaculty = postFaculty;
const putFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            FROM faculties
            WHERE faculty_id = $1;`, [Number(id)]);
        if (exitWorkDay.rows.length === 0) {
            return res.status(404).json({
                msg: "No information found with the provided id"
            });
        }
        yield connection_1.default.query(` 
            UPDATE faculties
            SET name = $1
            WHERE faculty_id = $2
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
                msg: "Faculty succesfully updated",
            });
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "Error updating Faculty",
            error: e
        });
    }
});
exports.putFaculty = putFaculty;
const deleteFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield connection_1.default.query(`
            DELETE FROM faculties 
            WHERE faculty_id = $1 
            RETURNING *;`, [Number(id)], (error, data) => {
            if (error) {
                console.error("Error data");
                return res.status(400).json({
                    msg: error.message
                });
            }
            if (data.rows.length === 0) {
                return res.status(400).json({
                    msg: "Faculty not found"
                });
            }
            ;
            res.json({
                msg: "successfull Faculty delete",
                deleted_user: data.rows
            });
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "Error delete Faculty",
            error: e
        });
    }
});
exports.deleteFaculty = deleteFaculty;
