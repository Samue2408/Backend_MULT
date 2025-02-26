"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getUsers = void 0;
const express_1 = require("express");
const connection_1 = __importDefault(require("../db/connection")); /*
import bcrypt from 'bcrypt';
*/
const saltRounds = 10; // Número de rondas para el salt de bcrypt
const getUsers = (res) => {
    connection_1.default.query('SELECT * FROM Users', ((error, data) => {
        if (error)
            throw error;
        res.json(data);
    }));
};
exports.getUsers = getUsers;
const getUser = (req, res) => {
    const { id } = req.params;
    connection_1.default.query('SELECT * FROM Users WHERE id = ?', [id], (error, data) => {
        if (error)
            throw error;
        express_1.response.json(data);
    });
};
exports.getUser = getUser;
/*
export const getCustomer = (req: Request, res: Response) => {
    connection.query('SELECT id, c_name, address, phone, email FROM Users WHERE role_id = 4', ((error, data) => {
        if(error) throw error;
        res.json(data);
    }))
}

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

export const postUser = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        // Hashear la contraseña
        if (body.password) {
            body.password = await bcrypt.hash(body.password, saltRounds);
        }

        connection.query('INSERT INTO Users SET ?', [body], (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: error.message
                })
            };

            res.json({
                msg: "User successfully created",
                body: body
            });
        });
    } catch (e) {
        res.status(500).json({
            msg: "Error creating user",
            error: e
        });
    }
};

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
