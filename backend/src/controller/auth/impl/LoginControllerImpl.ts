import { Request, Response } from 'express';
import { LoginServiceImpl } from '../../../service';
import { LoginRequest } from '../../../request';
import { LoginController } from '../..';
import { ResponseHelper } from '../../../response';
import { Logger } from '../../../config/logging/Logging';
import { BaseController, PostEndpoint } from '../../../annotations';

@BaseController('/api/v1/auth')
export class LoginControllerImpl implements LoginController {
    constructor(
        private loginService: LoginServiceImpl,
        private logger: Logger
    ) {}

    @PostEndpoint('/login')
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            const loginRequest: LoginRequest = {
                email,
                password
            };

            const response = await this.loginService.login(loginRequest);
            this.logger.info('Login successful');
            res.status(200).json(response);
        } catch (error: any) {
            this.logger.error(error.message);
            res.status(400).json(ResponseHelper.error(error.message));
        }
    }
}
