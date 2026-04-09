import express from 'express';
import cors from 'cors';
import { connectDB } from './database';
import dotenv from 'dotenv';
import { Logger, requestLogger } from './config';
import { MessageLib } from './utils';

import { registerControllers } from './annotations';
import { LoginControllerImpl, RegisterControllerImpl, UserControllerImpl } from './controller';
import { LoginServiceImpl, RegisterServiceImpl, UserServiceImplV1 } from './service';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

connectDB();
app.use(cors());
app.use(express.json());
app.use(requestLogger);

const logger = new Logger('app');

// Dependency Injection Setup
const loginService = new LoginServiceImpl();
const loginController = new LoginControllerImpl(loginService, new Logger('auth-routes'));

const registerService = new RegisterServiceImpl();
const registerController = new RegisterControllerImpl(registerService, new Logger('auth-routes'));

const userService = new UserServiceImplV1(new Logger('user-service'));
const userController = new UserControllerImpl(userService, new Logger('user-routes'));

// Register Routes via Decorators Loader
registerControllers(app, [
    loginController,
    registerController,
    userController
]);

app.listen(PORT, () => {
    logger.info(`${MessageLib.SERVER.STARTED} ${PORT} 🚀`);
});
