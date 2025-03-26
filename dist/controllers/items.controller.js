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
exports.deleteItem = exports.putItem = exports.postItem = exports.getItem = exports.getItems = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    connection_1.default.query(`
        SELECT 
            it.item_id,
            it.name,
            ty.name as type_activity_name,
            least_one
        FROM items it
        INNER JOIN type_activities ty ON ty.type_activity_id = it.type_activity_id;
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
exports.getItems = getItems;
const getItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    connection_1.default.query(`
        SELECT 
            it.item_id,
            it.name,
            ty.name as type_activity_name,
            least_one
        FROM items it
        INNER JOIN type_activities ty ON ty.type_activity_id = it.type_activity_id
        WHERE it.item_id = $1;
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
exports.getItem = getItem;
const postItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, type_activity_id, least_one } = req.body;
        if (!name || !type_activity_id || !least_one) {
            return res.status(400).json({
                msg: "The data failed is requerid"
            });
        }
        const Itemexist = yield connection_1.default.query(`
            SELECT name 
            FROM items 
            WHERE name = $1`, [name]);
        if (Itemexist.rows.length > 0) {
            return res.status(400).json({
                msg: "The item already exist"
            });
        }
        connection_1.default.query(`
            INSERT INTO items (name, type_activity_id, least_one)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [name, type_activity_id, least_one], (error, data) => {
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
                msg: "items succesfully created",
                body: data.rows
            });
        });
    }
    catch (e) {
        console.error("Error database details: " + e.message);
        return res.status(500).json({
            msg: "Error creating items",
            error: e
        });
    }
});
exports.postItem = postItem;
const putItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, type_activity_id, least_one } = req.body;
        if (!name || !type_activity_id || !least_one) {
            return res.status(400).json({
                msg: "The data failed is requerid"
            });
        }
        connection_1.default.query(`
            UPDATE items 
            SET name = $1, type_activity_id = $2, least_one = $3
            WHERE item_id = $4
            RETURNING *;
        `, [name, type_activity_id, least_one, Number(id)], (error, data) => {
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
                msg: "items succesfully updated",
                body: data.rows
            });
        });
    }
    catch (e) {
        console.error("Error database details: " + e.message);
        return res.status(500).json({
            msg: "Error updating item",
            error: e
        });
    }
});
exports.putItem = putItem;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        connection_1.default.query(`
            DELETE FROM items
            WHERE item_id = $1
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
            res.status(200).json({
                msg: "items succesfully deleted",
                body: data.rows
            });
        });
    }
    catch (e) {
        console.error("Error database details: " + e.message);
        return res.status(500).json({
            msg: "Error deleting item",
            error: e
        });
    }
});
exports.deleteItem = deleteItem;
