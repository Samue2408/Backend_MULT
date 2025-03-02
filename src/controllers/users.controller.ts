import { Request, Response, NextFunction, response } from "express";
import connection from "../db/connection";
import bcrypt from 'bcrypt';



const saltRounds = 10; // Número de rondas para el salt de bcrypt

export const getUsers = async (req: Request,  res: Response) => {

    connection.query(`
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
        if (error) console.error("Error database details: " + (error as any).message);          
        res.json(data.rows);
    });    
}   

export const getUser = async (req: Request, res: Response) => {
    
    const { id } = req.params;

    await connection.query(`
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
        if (error) throw error;
        
        res.json(data.rows);
    });
}


export const getUserByRole = async (req: Request, res: Response) => {
    
    const { role_id } = req.params;

    await connection.query(`
        SELECT 
            u.user_id AS usuario_id,
            u.full_name AS usuario_nombre,
            u.user AS usuario_email,
            r.name AS rol_nombre
        FROM users u
        INNER JOIN roles r ON u.role_id = r.role_id
        WHERE u.role_id = $1;
`, [Number(role_id)], (error, data) => {
        if (error) throw error;
        
        res.json(data.rows);
    });
}

export const postUser = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        
        // Hashear la contraseña
        if (body.password) {
            body.password = await bcrypt.hash(body.password, saltRounds);
        }
        
        const valores = Object.values(body);

        await connection.query(`
        INSERT INTO users (full_name, "user", password, level_training, role_id, working_day_id) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        `, valores, (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: error.message
                })
            };

            res.json({
                msg: "User successfully created",
                body: data.rows
            });
        });

    } catch (e) {
        res.status(500).json({
            msg: "Error creating user",
            error: e
        });
    }
};

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