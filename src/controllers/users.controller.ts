import { Request, Response, NextFunction, response } from "express";
import connection from "../db/connection";
import bcrypt from 'bcrypt';



const saltRounds = 10; // Número de rondas para el salt de bcrypt

export const getUsers = async (req: Request,  res: Response) => {

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
        `, [], (error, data) => {
        if (error) {
            console.error("Error database details: " + (error as any).message);          
        }
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
        if (error) {
            console.error("Error database details: " + (error as any).message);          
        }
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

export const postUser = async (req: Request, res: Response): Promise<any> => { // Promise<any> para evitar error en el return
    const { body } = req;

    try {

        const userExist = await connection.query('SELECT * FROM users WHERE "user" = $1', [body.user]);

        if(userExist.rows.length > 0) {
            return res.status(400).json({
                msg: "User already exists"
            });
        }
        
        // Hashear la contraseña
        if (body.password) {
            body.password = await bcrypt.hash(body.password, saltRounds);
        }        
        
        const values = Object.values(body);

        await connection.query(`
            INSERT INTO users (full_name, "user", password, level_training, role_id, working_day_id) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, values, (error, data) => {
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


export const deleteUser = (req: Request, res: Response) => {
    
    const { id } = req.params;

    connection.query('DELETE FROM users WHERE user_id = $1 RETURNING *;', [id], (error, data) => {
        if (error) throw error;

        if(data.rows.length === 0) {
            return res.status(400).json({
                msg: "User not found"
            });
        }
        
        res.json({
            msg: "successfull user delete",
            deleted_user: data.rows
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

        body.user_id = id;

        console.log(body);

        const values = Object.values(body);

        await connection.query(`
            UPDATE users
            SET full_name = $1, "user" = $2, password = $3, level_training = $4, role_id = $5, working_day_id = $6 
            WHERE user_id = $7
            RETURNING *;
        `, values, (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: error.message
                })
            };
            
            res.json({
                msg: "User successfully updated",
                updated_user: data.rows
            });
        });

    } catch (e) {
            res.status(500).json({
                msg: "Error updating user",
                error: e
            });
        }
};

/*

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