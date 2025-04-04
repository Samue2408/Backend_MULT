import { Request, Response, NextFunction } from "express";
import connection from "../db/connection";
import bcrypt from 'bcrypt';


const saltRounds = 10; // Número de rondas para el salt de bcrypt

export const getUsers = async (req: Request,  res: Response) => {

    await connection.query(`
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
            console.error("Error database details: " + (error as any).message); 
            return res.status(500).json({ message: 'Error en el servidor' });   
        }
        res.json(data.rows);
    });    
}   

export const getUser = async (req: Request, res: Response) => {
    
    const { id } = req.params;

    await connection.query(`
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
            console.error("Error database details: " + (error as any).message);  
            return res.status(500).json({ message: 'Error en el servidor' });           
        }

        if(data.rows.length === 0) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        res.json(data.rows);
    });
}

export const getUserByRole = async (req: Request, res: Response) => {
    
    const { role_id } = req.params;

    await connection.query(`
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

        if(data.rows.length === 0) {
            return res.status(404).json({
                msg: "User not found"
            });
        }
        
        res.json(data.rows);
    });
}

export const postUser = async (req: Request, res: Response): Promise<any> => { // Promise<any> para evitar error en el return
    const { body } = req;

    try {

        const userExist = await connection.query('SELECT * FROM users WHERE email = $1', [body.email]);

        if(userExist.rows.length > 0) {
            return res.status(400).json({
                msg: "Email already exists"
            });
        }

        // Hashear la contraseña
        if (body.password) {
            body.password = await bcrypt.hash(body.password, saltRounds);
        }        
        
        const values = [
            body.full_name,
            body.email,
            body.password,
            body.level_training,
            body.role_id,
            body.working_day_id
        ]

        if( values.some((value) => value === undefined )){
            return res.status(400).json({
                msg: "Incorrect keys"
            });
        }

        await connection.query(`
            INSERT INTO users (full_name, email, password, level_training, role_id, working_day_id) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, values, (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: error.message
                })
            };

            if(data.rows.length === 0) {
                return res.status(400).json({
                    msg: "Invalid data"
                });
            }

            res.status(201).json({
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
        if (error) {
            console.error("Error database details: " + error.message);
            return res.status(500).json({
                msg: error.message
            })
        };

        if(data.rows.length === 0) {
            return res.status(400).json({
                msg: "User not found"
            });
        };
        
        res.json({
            msg: "successfull user delete",
            deleted_user: data.rows
        })
    });    
};

export const putUser = async (req: Request, res: Response): Promise<any> => {
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
        ]

        if( values.some((value) => value === undefined )){
            return res.status(400).json({
                msg: "Incorrect json keys"
            });
        }              

        await connection.query(`
            UPDATE users
            SET full_name = $1, email = $2, level_training = $3, role_id = $4, working_day_id = $5
            WHERE user_id = $6
            RETURNING *;
        `, values, (error, data) => {
            if (error) {
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: error.message
                })
            };

            if(data.rows.length === 0) {
                return res.status(400).json({
                    msg: "Invalid data"
                });
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

export const verifyUserCredentials = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    
    connection.query('SELECT * FROM users WHERE email = $1', [email], async (error, data) => {
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
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password inválido' });
        }
        next();
    });
}; 

export const changePassword = async (req: Request, res: Response): Promise<any> => {

    const { password, new_password, user_id } = req.body
    
    try {
       
        const { rows } = await connection.query(`SELECT * FROM users WHERE user_id = $1`, [user_id]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        const password_old = rows[0].password

        const same_password = await bcrypt.compare(password, password_old)

        if (!same_password) {
            return res.status(401).json({
                msg: "Current password invalid"
            })
        };

        const hash_new_password = await bcrypt.hash(new_password, saltRounds)

        await connection.query(`
            UPDATE users
            SET password = $1
            WHERE user_id = $2
            RETURNING *;
        `, [hash_new_password, user_id], (error, data) => {
            if (error) {
                
                console.error("Error database details: " + error.message);
                return res.status(500).json({
                    msg: error.message
                })
            };

            if(data.rows.length === 0) {
                return res.status(400).json({
                    msg: "Invalid data"
                });
            };

            const user = data.rows[0]
            user.password = undefined // Eliminar la contraseña del objeto de respuesta
            
            res.json({
                msg: "User successfully updated",
                updated_user: user
            });
        });


    } catch (error) {
        res.status(500).json({
            msg: "Error en el servidor"
        })
    }

}