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
exports.changePassword = exports.verifyUserCredentials = exports.putUser = exports.deleteUser = exports.postUser = exports.getUserByRole = exports.getUser = exports.getUsers = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10; // Número de rondas para el salt de bcrypt
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection_1.default.query(`
            SELECT 
                u.user_id,
                u.full_name,
                u.email,
                u.level_training,
                r.name AS role,
                wd.name AS working_day
            FROM users u
            INNER JOIN roles r ON u.role_id = r.role_id
            LEFT JOIN working_days wd ON u.working_day_id = wd.working_day_id
        `, [], (error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        res.json(data.rows);
    });
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield connection_1.default.query(`
        SELECT 
            u.user_id,
            u.full_name,
            u.email,
            u.level_training,
            r.name AS role,
            wd.name AS working_day
        FROM users u
        INNER JOIN roles r ON u.role_id = r.role_id
        LEFT JOIN working_days wd ON u.working_day_id = wd.working_day_id
        WHERE u.user_id = $1;
        `, [Number(id)], (error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        if (data.rows.length === 0) {
            return res.status(404).json({
                msg: "User not found"
            });
        }
        res.json(data.rows);
    });
});
exports.getUser = getUser;
const getUserByRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role_id } = req.params;
    yield connection_1.default.query(`
        SELECT 
            u.user_id,
            u.full_name,
            u.email,
            u.level_training,
            r.name AS role,
            wd.name AS working_day
        FROM users u
        INNER JOIN roles r ON u.role_id = r.role_id
        LEFT JOIN working_days wd ON u.working_day_id = wd.working_day_id
        WHERE u.role_id = $1;
`, [Number(role_id)], (error, data) => {
        if (error) {
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        if (data.rows.length === 0) {
            return res.status(404).json({
                msg: "User not found"
            });
        }
        res.json(data.rows);
    });
});
exports.getUserByRole = getUserByRole;
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        const userExist = yield connection_1.default.query('SELECT * FROM users WHERE email = $1', [body.email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({
                msg: "Email already exists"
            });
        }
        // Hashear la contraseña
        if (body.password) {
            body.password = yield bcrypt_1.default.hash(body.password, saltRounds);
        }
        const values = [
            body.full_name,
            body.email,
            body.password,
            body.level_training,
            body.role_id,
            body.working_day_id
        ];
        if (values.some((value) => value === undefined)) {
            return res.status(400).json({
                msg: "Incorrect keys"
            });
        }
        yield connection_1.default.query(`
            INSERT INTO users (full_name, email, password, level_training, role_id, working_day_id) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, values, (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: error.message
                });
            }
            ;
            if (data.rows.length === 0) {
                return res.status(400).json({
                    msg: "Invalid data"
                });
            }
            res.status(201).json({
                msg: "User successfully created",
                body: data.rows
            });
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "Error creating user",
            error: e
        });
    }
});
exports.postUser = postUser;
const deleteUser = (req, res) => {
    const { id } = req.params;
    connection_1.default.query('DELETE FROM users WHERE user_id = $1 RETURNING *;', [id], (error, data) => {
        if (error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: error.message
            });
        }
        ;
        if (data.rows.length === 0) {
            return res.status(400).json({
                msg: "User not found"
            });
        }
        ;
        res.json({
            msg: "successfull user delete",
            deleted_user: data.rows
        });
    });
};
exports.deleteUser = deleteUser;
const putUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = req.params;
    try {
        body.user_id = id;
        const values = [
            body.full_name,
            body.email,
            body.level_training,
            body.role_id,
            body.working_day_id
        ];
        if (values.some((value) => value === undefined)) {
            return res.status(400).json({
                msg: "Incorrect json keys"
            });
        }
        yield connection_1.default.query(`
            UPDATE users
            SET full_name = $1, email = $2, level_training = $3, role_id = $4, working_day_id = $5
            WHERE user_id = $6
            RETURNING *;
        `, values, (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: error.message
                });
            }
            ;
            if (data.rows.length === 0) {
                return res.status(400).json({
                    msg: "Invalid data"
                });
            }
            ;
            res.json({
                msg: "User successfully updated",
                updated_user: data.rows
            });
        });
    }
    catch (e) {
        res.status(500).json({
            msg: "Error updating user",
            error: e
        });
    }
});
exports.putUser = putUser;
const verifyUserCredentials = (req, res, next) => {
    const { email, password } = req.body;
    connection_1.default.query('SELECT * FROM users WHERE email = $1', [email], (error, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        if (data.rows.length === 0) {
            return res.status(401).json({ message: 'Email inválido' });
        }
        const user = data.rows[0];
        res.locals.user = user;
        // Compara la contraseña ingresada con la almacenada (que está cifrada)
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password inválido' });
        }
        next();
    }));
};
exports.verifyUserCredentials = verifyUserCredentials;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, new_password, user_id } = req.body;
    try {
        const { rows } = yield connection_1.default.query(`SELECT * FROM users WHERE user_id = $1`, [user_id]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }
        const password_old = rows[0].password;
        const same_password = yield bcrypt_1.default.compare(password, password_old);
        if (!same_password) {
            return res.status(401).json({
                msg: "Current password invalid"
            });
        }
        ;
        const hash_new_password = yield bcrypt_1.default.hash(new_password, saltRounds);
        yield connection_1.default.query(`
            UPDATE users
            SET password = $1
            WHERE user_id = $2
            RETURNING *;
        `, [hash_new_password, user_id], (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: error.message
                });
            }
            ;
            if (data.rows.length === 0) {
                return res.status(400).json({
                    msg: "Invalid data"
                });
            }
            ;
            const user = data.rows[0];
            user.password = undefined; // Eliminar la contraseña del objeto de respuesta
            res.json({
                msg: "User successfully updated",
                updated_user: user
            });
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "Error en el servidor"
        });
    }
});
exports.changePassword = changePassword;
