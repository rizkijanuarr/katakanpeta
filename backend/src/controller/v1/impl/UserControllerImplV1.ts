import { Request, Response } from "express";
import { UserControllerV1 } from "../..";
import { UserServiceImplV1 } from "../../../service";
import { UserRequestV1 } from "../../../request";
import { MessageLib, RoleEnum } from "../../../utils";
import { Logger } from "../../../config/logging/Logging";
import { AuthorizationRoleMiddleware, JwtAuthFilter } from "../../../config";
import { BaseController, GetEndpoint, PostEndpoint, PutEndpoint, DeleteEndpoint } from "../../../annotations";

@BaseController('/api/v1/users')
export class UserControllerImpl implements UserControllerV1 {
    constructor(
        private userService: UserServiceImplV1,
        private logger: Logger
    ) {}

    @PostEndpoint('/', [JwtAuthFilter, AuthorizationRoleMiddleware([RoleEnum.ADMIN])])
    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password, role } = req.body;
            const createUserRequest: UserRequestV1 = { name, email, password, role: role as RoleEnum };
            const response = await this.userService.createUser(createUserRequest);
            res.status(201).json(response);
        } catch (error: any) {
            this.logger.error(error.message);
            res.status(400).json({ message: error.message });
        }
    }

    @GetEndpoint('/', [JwtAuthFilter, AuthorizationRoleMiddleware([RoleEnum.ADMIN])])
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.userService.getAllUsers();
            this.logger.info(MessageLib.USER.USER_RETRIEVED);
            res.status(200).json(response);
        } catch (error: any) {
            this.logger.error(error.message);
            res.status(500).json({ message: error.message });
        }
    }

    @GetEndpoint('/:id', [JwtAuthFilter, AuthorizationRoleMiddleware([RoleEnum.ADMIN, RoleEnum.USER])])
    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const response = await this.userService.getUserById(id);
            this.logger.info(`Getting user by ID: ${id}`);
            res.status(200).json(response);
        } catch (error: any) {
            if (error.message === MessageLib.USER.USER_NOT_FOUND || error.message === MessageLib.USER.USER_INVALID_ID) {
                this.logger.error(error.message);
                res.status(404).json({ message: error.message });
            } else {
                this.logger.error(error.message);
                res.status(500).json({ message: error.message });
            }
        }
    }

    @PutEndpoint('/:id', [JwtAuthFilter, AuthorizationRoleMiddleware([RoleEnum.ADMIN])])
    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const { name, email, password, role } = req.body;
            const updateUserRequest: UserRequestV1 = { name, email, password, role: role as RoleEnum };
            if (name) updateUserRequest.name = name;
            if (email) updateUserRequest.email = email;
            if (password) updateUserRequest.password = password;
            if (role) updateUserRequest.role = role as RoleEnum;

            const response = await this.userService.updateUser(id, updateUserRequest);
            this.logger.info(`Updating user by ID: ${id}`);
            res.status(200).json(response);
        } catch (error: any) {
             if (error.message === MessageLib.USER.USER_NOT_FOUND || error.message === MessageLib.USER.USER_INVALID_ID) {
                this.logger.error(error.message);
                res.status(404).json({ message: error.message });
            } else {
                this.logger.error(error.message);
                res.status(500).json({ message: error.message });
            }
        }
    }

    @DeleteEndpoint('/:id', [JwtAuthFilter, AuthorizationRoleMiddleware([RoleEnum.ADMIN])])
    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const response = await this.userService.deleteUser(id);
            this.logger.info(`Deleting user by ID: ${id}`);
            res.status(200).json(response);
        } catch (error: any) {
            if (error.message === "User not found" || error.message === "Invalid user ID") {
                this.logger.error(error.message);
                res.status(404).json({ message: error.message });
            } else {
                this.logger.error(error.message);
                res.status(500).json({ message: error.message });
            }
        }
    }
}
