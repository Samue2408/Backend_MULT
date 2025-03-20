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
exports.deleteRole = exports.putRole = exports.postRole = exports.getRole = exports.getRoles = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    connection_1.default.query(`
        SELECT 
            r.role_id,
            r.name
        FROM roles r
    `, [], (error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: "Error database details"
            });
        }
        res.json(data.rows);
    });
});
exports.getRoles = getRoles;
const getRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield connection_1.default.query(`
        SELECT 
            r.role_id,
            r.name,
        FROM roles r
        WHERE r.role_id = $1;
        `, [Number(id)], (error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            res.status(500).json({ message: 'Error en el servidor' });
        }
        if (data.rows.length === 0) {
            return res.status(404).json({
                msg: "Role not found"
            });
        }
        res.json(data.rows);
    });
});
exports.getRole = getRole;
const postRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        //verificamos que el campo name no venga vacio
        if (!name) {
            return res.status(400).json({
                msg: "The name field is required"
            });
        }
        // Verificar si el rol ya existe
        const roleExists = yield connection_1.default.query(`SELECT * FROM roles WHERE name = $1;`, [name]);
        if (roleExists.rows.length > 0) {
            return res.status(400).json({
                msg: "Role already exists"
            });
        }
        // Insertar nuevo rol
        const result = yield connection_1.default.query(`INSERT INTO roles (name) VALUES ($1) RETURNING *;`, [name]);
        return res.status(201).json({
            msg: "Role created",
            role: result.rows[0]
        });
    }
    catch (e) {
        console.error("Database error:", e);
        return res.status(500).json({
            msg: "Error creating role",
            error: e
        });
    }
});
exports.postRole = postRole;
const putRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({
            msg: "The name or id field is required"
        });
    }
    yield connection_1.default.query(`
        UPDATE roles
        SET name = $1
        WHERE role_id = $2;
    `, [name, Number(id)], (error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json({
            msg: "Role updated"
        });
    });
});
exports.putRole = putRole;
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield connection_1.default.query(`
        DELETE FROM roles
        WHERE role_id = $1;
    `, [Number(id)], (error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            res.status(500).json({ message: 'Error en el servidor' });
        }
        if (data.rowCount === 0) {
            return res.status(400).json({
                msg: "Role not fount"
            });
        }
        res.json({
            msg: "Role deleted"
        });
    });
});
exports.deleteRole = deleteRole;
