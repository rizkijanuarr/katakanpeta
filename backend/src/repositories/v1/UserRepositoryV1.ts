import bcrypt from "bcrypt";
import { dbPool } from "../../database";
import { UserRequestV1 } from "../../request";
import { Logger } from "../../config";

export class UserRepositoryV1 {
    async findOneByEmail(email: string) {
        const { rows } = await dbPool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
        return rows[0] || null;
    }

    async createUser(data: {
        name: string;
        email: string;
        password: string;
        role: string;
        createdBy: string;
    }) {
        const { name, email, password, role, createdBy } = data;
        const query = `
          INSERT INTO users (name, email, password, role, "createdBy", "createdDate") 
          VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`;
        const { rows } = await dbPool.query(query, [name, email, password, role, createdBy]);
        return rows[0];
    }

    async findAll() {
        const logger = new Logger("UserRepositoryV1");
        try {
            logger.info("Fetching all users from the database");
            const { rows } = await dbPool.query('SELECT * FROM users ORDER BY "createdDate" DESC');
            return rows.map((u: any) => {
                const { password, ...rest } = u;
                return rest;
            });
        } catch (error) {
            logger.error("Error fetching users: ", error);
            throw new Error("Failed to fetch users");
        }
    }

    async findById(id: string) {
        if (!id) return null;
        const { rows } = await dbPool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
        if (rows.length === 0) return null;
        const { password, ...rest } = rows[0];
        return rest;
    }

    async updateUser(id: string, request: UserRequestV1) {
        if (!id) return null;
        
        let updateQuery = 'UPDATE users SET ';
        const values: any[] = [];
        let index = 1;
        
        if (request.name) { updateQuery += `name = $${index}, `; values.push(request.name); index++; }
        if (request.email) { updateQuery += `email = $${index}, `; values.push(request.email); index++; }
        if (request.role) { updateQuery += `role = $${index}, `; values.push(request.role); index++; }
        
        if (request.password) {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(request.password, salt);
            updateQuery += `password = $${index}, `; values.push(hashed); index++;
        }
        
        updateQuery += `"modifiedDate" = NOW() WHERE id = $${index} RETURNING *`;
        values.push(id);
        
        const { rows } = await dbPool.query(updateQuery, values);
        if (rows.length === 0) return null;
        const { password, ...rest } = rows[0];
        return rest;
    }

    async deleteUser(id: string) {
        if (!id) return null;
        const { rows } = await dbPool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        return rows[0] || null;
    }
}
