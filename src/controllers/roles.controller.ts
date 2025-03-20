import { Request, Response} from "express";
import connection from "../db/connection";

export const getRoles = async (req: Request, res: Response) => {

    connection.query(`
        SELECT 
            r.role_id,
            r.name
        FROM roles r
    `, [], (error, data) => {
        if (error) {
            console.error("Error database details: " + (error as any).message);
            return res.status(500).json({
                msg: "Error database details"
            })
        }
        res.json(data.rows);
    });    

}

export const getRole = async (req: Request, res: Response) => {
    
    const { id } = req.params;

    await connection.query(`
        SELECT 
            r.role_id,
            r.name,
        FROM roles r
        WHERE r.role_id = $1;
        `, [Number(id)], (error, data) => {
        if (error) {
            console.error("Error database details: " + (error as any).message);  
            res.status(500).json({ message: 'Error en el servidor' });           
        }

        if(data.rows.length === 0) {
            return res.status(404).json({
                msg: "Role not found"
            });
        }

        res.json(data.rows);
    });
}


export const postRole = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name } = req.body;

        //verificamos que el campo name no venga vacio
        if (!name) {
            return res.status(400).json({
                msg: "The name field is required"
            });
        }

        // Verificar si el rol ya existe
        const roleExists = await connection.query(
            `SELECT * FROM roles WHERE name = $1;`, 
            [name]
        );

        if (roleExists.rows.length > 0) {
            return res.status(400).json({
                msg: "Role already exists"
            });
        }

        // Insertar nuevo rol
        const result = await connection.query(
            `INSERT INTO roles (name) VALUES ($1) RETURNING *;`, 
            [name]
        );

        return res.status(201).json({
            msg: "Role created",
            role: result.rows[0]
        });

    } catch (e) {
        console.error("Database error:", e);
        return res.status(500).json({
            msg: "Error creating role",
            error: e
        });
    }
};


export const putRole = async (req: Request, res: Response) : Promise<any> => {
    
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            msg: "The name or id field is required"
        });
    }

    await connection.query(`
        UPDATE roles
        SET name = $1
        WHERE role_id = $2;
    `, [name, Number(id)], (error, data) => {
        if (error) {
            console.error("Error database details: " + (error as any).message);  
            res.status(500).json({ message: 'Error en el servidor' });           
        }

        res.json({
            msg: "Role updated"
        });
    });
}

export const deleteRole = async (req: Request, res: Response) => {
    
    const { id } = req.params;

    await connection.query(`
        DELETE FROM roles
        WHERE role_id = $1;
    `, [Number(id)], (error, data) => {
        if (error) {
            console.error("Error database details: " + (error as any).message);  
            res.status(500).json({ message: 'Error en el servidor' });           
        }

        if (data.rowCount === 0) {
            return res.status(400).json({
                msg: "Role not fount"
            })
        }

        res.json({
            msg: "Role deleted"
        });
    });
}




