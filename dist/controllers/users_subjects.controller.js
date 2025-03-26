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
exports.deleteUserSubject = exports.putUserSubject = exports.postUserSubject = exports.getUserSubject = exports.getUsersSubjects = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getUsersSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    connection_1.default.query(`
        SELECT 
            us.user_subject_id,
            u.full_name as user_name,
            s.name as subject_name,
            g.name as group_name,
            us.semester,
            us.year,
            us.period_year
        FROM users_subjects us
        INNER JOIN users u ON u.user_id = us.user_id
        INNER JOIN subjects s ON s.subject_id = us.subject_id
        INNER JOIN groups g ON g.group_id = us.group_id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    `, [], (error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: "Error database details"
            });
        }
        if (data.rows.length === 0) {
            return res.json({
                msg: "invalid data: no subject found"
            });
        }
        res.json(data.rows);
    });
});
exports.getUsersSubjects = getUsersSubjects;
const getUserSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    connection_1.default.query(`
        SELECT 
            us.user_subject_id,
            u.full_name as user_name,
            s.name as subject_name,
            g.name as group_name,
            us.semester,
            us.year,
            us.period_year
        FROM users_subjects us
        INNER JOIN users u ON u.user_id = us.user_id
        INNER JOIN subjects s ON s.subject_id = us.subject_id
        INNER JOIN groups g ON g.group_id = us.group_id
        WHERE us.user_subject_id = $1;
    `, [Number(id)], (error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: "Error database details"
            });
        }
        if (data.rows.length === 0) {
            console.error("Invalid data: " + error.message);
            return res.json({
                msg: "invalid data: no subject found"
            });
        }
        res.json(data.rows);
    });
});
exports.getUserSubject = getUserSubject;
const postUserSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, subject_id, group_id, semester, year, period_year } = req.body;
        yield connection_1.default.query(`
            INSERT INTO users_subjects (user_id, subject_id, group_id, semester, year, period_year)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [user_id, subject_id, group_id, semester, year, period_year], (error, data) => {
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
            return res.status(201).json({
                msg: "User subject created"
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
exports.postUserSubject = postUserSubject;
const putUserSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { user_id, subject_id, group_id, semester, year, period_year } = req.body;
        if (!user_id || !subject_id || !group_id || !semester || !year || !period_year) {
            return res.status(400).json({
                msg: "The user_id, subject_id, group_id, semester, year, period_year field is required"
            });
        }
        yield connection_1.default.query(`
            UPDATE users_subjects
            SET user_id = $1, subject_id = $2, group_id = $3, semester = $4, year = $5, period_year = $6
            WHERE user_subject_id = $7;
        `, [user_id, subject_id, group_id, semester, year, period_year, Number(id)], (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: "Error database details"
                });
            }
            return res.status(201).json({
                msg: "User subject updated"
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
exports.putUserSubject = putUserSubject;
const deleteUserSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield connection_1.default.query(`
            DELETE FROM users_subjects
            WHERE user_subject_id = $1
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
            return res.status(201).json({
                msg: "User subject deleted"
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
exports.deleteUserSubject = deleteUserSubject;
