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
exports.findRefreshToken = exports.refreshAccessToken = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connection_1 = __importDefault(require("../db/connection"));
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const generateTokens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        yield deleteRefreshToken(token);
    }
    try {
        const { user_id } = req.body;
        const access_token = yield generateAccessToken(user_id);
        const refresh_token = yield generateRefreshToken(user_id);
        connection_1.default.query(`
            INSERT INTO refresh_tokens (user_id, token, created_at)
            VALUES ($1, $2, NOW());
        `, [user_id, refresh_token], (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: error.message
                });
            }
            ;
            res.json({
                msg: "Sign in successfully",
                access_token,
                refresh_token,
                user_id
            });
        });
    }
    catch (error) {
        console.error("Error generate token: " + error.message);
    }
});
exports.generateTokens = generateTokens;
const generateAccessToken = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield jsonwebtoken_1.default.sign({ userId: user_id }, JWT_SECRET, { expiresIn: '1h' });
});
const generateRefreshToken = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield jsonwebtoken_1.default.sign({ userId: user_id }, JWT_SECRET, { expiresIn: '7d' });
});
const deleteRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection_1.default.query('DELETE FROM refresh_tokens WHERE token = $1', [token], (error, data) => {
        if (error)
            console.error("Error database details: " + error.message);
        console.log(data);
    });
});
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            msg: "Token not found"
        });
    }
    const result = yield connection_1.default.query('SELECT * FROM refresh_tokens WHERE token = $1', [token]);
    if (result.rows.length === 0) {
        return res.status(403).json({
            msg: "Invalid Refresh Token"
        });
    }
    const { user_id } = result.rows[0];
    res.json({
        access_token: yield generateAccessToken(user_id)
    });
});
exports.refreshAccessToken = refreshAccessToken;
const findRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = res.locals.user;
    connection_1.default.query('SELECT * FROM refresh_tokens WHERE user_id = $1', [user_id], (error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: error.message
            });
        }
        if (data.rows.length === 0) {
            return res.json({
                active_session: false,
                msg: "Without active session"
            });
        }
        res.json({
            active_session: true,
            msg: "You have an active session",
            data: data.rows
        });
    });
});
exports.findRefreshToken = findRefreshToken;
