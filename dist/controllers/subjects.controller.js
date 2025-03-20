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
exports.deleteSubject = exports.putSubject = exports.postSubject = exports.getSubject = exports.getSubjects = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    connection_1.default.query(`
        SELECT 
            s.subject_id,
            s.name,
            s.hours,
            s.credits,
            f.name as faculty_name
        FROM subjects s
        INNER JOIN faculties f ON f.faculty_id = s.faculty_id;
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
        res.json(data.rows);
    });
});
exports.getSubjects = getSubjects;
const getSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    connection_1.default.query(`
        SELECT 
            s.subject_id,
            s.name,
            s.hours,
            s.credits,
            f.name as faculty_name
        FROM subjects s
        INNER JOIN faculties f ON f.faculty_id = s.faculty_id;
        WHERE s.subject_id = $1;
    `, [Number(id)], (error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: "Error database details"
            });
        }
        if (data.rows.length === 0) {
            return res.status(404).json({
                msg: "invalid data"
            });
        }
        res.json(data.rows);
    });
});
exports.getSubject = getSubject;
const postSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, hours, credits, faculty_id } = req.body;
        if (!name || !hours || !credits || !faculty_id) {
            return res.status(400).json({
                msg: "The data failed is requerid"
            });
        }
        const exitSubject = yield connection_1.default.query(`
            SELECT name 
            FROM subjects 
            WHERE name = $1`, [name]);
        if (exitSubject.rows.length > 0) {
            return res.status(400).json({
                msg: "The subject already exist"
            });
        }
        connection_1.default.query(`
            INSERT INTO subjects (name, hours, credits, faculty_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [name, hours, credits, faculty_id], (error, data) => {
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
                msg: "subjects succesfully created",
                body: data.rows
            });
        });
    }
    catch (e) {
        console.error("Error database details: " + e.message);
        return res.status(500).json({
            msg: "Error creating subject",
            error: e
        });
    }
});
exports.postSubject = postSubject;
const putSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, hours, credits, faculty_id } = req.body;
        if (!name || !hours || !credits || !faculty_id) {
            return res.status(400).json({
                msg: "The data failed is requerid"
            });
        }
        connection_1.default.query(`
            UPDATE subjects
            SET name = $1, hours = $2, credits = $3, faculty_id = $4 
            WHERE subject_id = $5
            RETURNING *;
        `, [name, hours, credits, faculty_id, Number(id)], (error, data) => {
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
            res.json({
                msg: "subject succesfully updated",
                body: data.rows
            });
        });
    }
    catch (e) {
        console.error("Error database details: " + e.message);
        return res.status(500).json({
            msg: "Error updating subject",
            error: e
        });
    }
});
exports.putSubject = putSubject;
const deleteSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        connection_1.default.query(`
            DELETE FROM subjects
            WHERE subject_id = $1
            RETURNING *;
        `, [Number(id)], (error, data) => {
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
            res.json({
                msg: "subject succesfully deleted",
                body: data.rows
            });
        });
    }
    catch (e) {
        console.error("Error database details: " + e.message);
        return res.status(500).json({
            msg: "Error deleting subject",
            error: e
        });
    }
});
exports.deleteSubject = deleteSubject;
