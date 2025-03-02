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
exports.postUser = exports.getUserByRole = exports.getUser = exports.getUsers = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10; // Número de rondas para el salt de bcrypt
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    connection_1.default.query(`
            SELECT 
                u.user_id AS usuario_id,
                u.full_name AS usuario_nombre,
                u.user AS usuario,
                u.level_training AS nivel_formacion,
                r.name AS rol_nombre,
                wd.name AS working_day
            FROM users u
            INNER JOIN roles r ON u.role_id = r.role_id
            LEFT JOIN working_days wd ON u.working_day_id = wd.working_day_id
        `, [], (error, data) => {
        if (error)
            console.error("Error database details: " + error.message);
        res.json(data.rows);
    });
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield connection_1.default.query(`
        SELECT 
            u.user_id AS usuario_id,
            u.full_name AS usuario_nombre,
            u.user AS usuario,
            u.level_training AS nivel_formacion,
            r.name AS rol_nombre,
            wd.name AS working_day
        FROM users u
        INNER JOIN roles r ON u.role_id = r.role_id
        LEFT JOIN working_days wd ON u.working_day_id = wd.working_day_id
        WHERE u.user_id = $1;
        `, [Number(id)], (error, data) => {
        if (error)
            throw error;
        res.json(data.rows);
    });
});
exports.getUser = getUser;
const getUserByRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role_id } = req.params;
    yield connection_1.default.query(`
        SELECT 
            u.user_id AS usuario_id,
            u.full_name AS usuario_nombre,
            u.user AS usuario_email,
            r.name AS rol_nombre
        FROM users u
        INNER JOIN roles r ON u.role_id = r.role_id
        WHERE u.role_id = $1;
`, [Number(role_id)], (error, data) => {
        if (error)
            throw error;
        res.json(data.rows);
    });
});
exports.getUserByRole = getUserByRole;
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        const userExist = yield connection_1.default.query('SELECT * FROM users WHERE "user" = $1', [body.user]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({
                msg: "User already exists"
            });
        }
        // Hashear la contraseña
        if (body.password) {
            body.password = yield bcrypt_1.default.hash(body.password, saltRounds);
        }
        const valores = Object.values(body);
        yield connection_1.default.query(`
            INSERT INTO users (full_name, "user", password, level_training, role_id, working_day_id) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, valores, (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: error.message
                });
            }
            ;
            res.json({
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
/*
export const deleteUser = (req: Request, res: Response) => {
    
    const { id } = req.params;

    connection.query('DELETE FROM Users WHERE id = ?', id, (error, data) => {
        if (error) throw error;
        
        res.json({
            msg: "successfull user delete",
            id: id
        })
    });

    
}


// Función para actualizar un usuario
export const putUser = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {
        // Hashear la contraseña solo si existe en el cuerpo de la solicitud
        if (body.password) {
            body.password = await bcrypt.hash(body.password, saltRounds);
        }

        connection.query('UPDATE Users SET ? WHERE id = ?', [body, id], (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: error.message
                })
            };

            res.json({
                msg: "User successfully updated",
                body: body
            });
        });
    } catch (e) {
        res.status(500).json({
            msg: "Error updating user",
            error: e
        });
    }
};


export const verifyUserCredentials = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    connection.query<User[]>('SELECT * FROM Users WHERE email = ?', [email], async (error, data) => {
        if (error) {
            return res.status(500).json({ message: 'Error en el servidor' });
        }

        if (data.length === 0) {
            return res.status(401).json({ message: 'Email inválido' });
        }

        const user = data[0];

        // Compara la contraseña ingresada con la almacenada (que está cifrada)
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password inválido' });
        }

        // Retorna el usuario para el controlador de UserToken
        res.locals.user = {
            id: user.id,
            name: user.c_name,
            email: user.email,
            role: user.role_id,
            phone: user.phone,
            address: user.address
            // Puedes agregar otros datos del usuario si los necesitas
        };

        // Continúa con el siguiente middleware (el controlador de token)
        res.locals.authenticated = true;
        
        next();
    });
}; */ 
