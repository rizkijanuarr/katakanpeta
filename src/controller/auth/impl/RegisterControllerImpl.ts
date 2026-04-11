import { Request, Response } from "express";
import { RegisterController } from "../..";
import { RegisterServiceImpl } from "../../../service";
import { RegisterRequest } from "../../../request";
import { RoleEnum } from "../../../utils";
import { ResponseHelper } from "../../../response";
import { Logger } from "../../../config/logging/Logging";
import { BaseController, PostEndpoint } from '../../../annotations';

@BaseController('/api/v1/auth')
export class RegisterControllerImpl implements RegisterController {
    constructor(
        private registerService: RegisterServiceImpl,
        private logger: Logger
    ) {}

    @PostEndpoint('/register')
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password, role } = req.body;

            const registerRequest: RegisterRequest = {
                name,
                email,
                password,
                role: role as RoleEnum,
            };

            const response = await this.registerService.register(registerRequest);
            this.logger.info("Register successful");
            res.status(201).json(response);
        } catch (error: any) {
            this.logger.error(error.message);
            res.status(400).json(ResponseHelper.error(error.message));
        }
    }
}
