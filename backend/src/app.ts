import express from 'express';
import cors from 'cors';
import { connectDB } from './database';
import dotenv from 'dotenv';
import { Logger, requestLogger } from './config';
import { MessageLib } from './utils';

import { registerControllers } from './annotations';
import { LoginControllerImpl, RegisterControllerImpl, UserControllerImpl, TransactionControllerImplV1, ScrapeControllerImplV1, DashboardControllerImplV1 } from './controller';
import { LoginServiceImpl, RegisterServiceImpl, UserServiceImplV1, TransactionServiceImplV1, ScrapeServiceImplV1, DashboardServiceImplV1 } from './service';
import { ForgotPasswordControllerImpl } from './controller/auth/impl/ForgotPasswordControllerImpl';
import { MeControllerImpl } from './controller/auth/impl/MeControllerImpl';
import { LogoutControllerImpl } from './controller/auth/impl/LogoutControllerImpl';
import { LogoutServiceImpl } from './service/auth/impl/LogoutServiceImpl';

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

const forgotPasswordController = new ForgotPasswordControllerImpl();
const meController = new MeControllerImpl();

const logoutService = new LogoutServiceImpl();
const logoutController = new LogoutControllerImpl(logoutService, new Logger('auth-routes'));

const userService = new UserServiceImplV1(new Logger('user-service'));
const userController = new UserControllerImpl(userService, new Logger('user-routes'));

const transactionService = new TransactionServiceImplV1();
const transactionController = new TransactionControllerImplV1(transactionService, new Logger('transaction-routes'));

const scrapeService = new ScrapeServiceImplV1();
const scrapeController = new ScrapeControllerImplV1(scrapeService, new Logger('scrape-routes'));

const dashboardService = new DashboardServiceImplV1();
const dashboardController = new DashboardControllerImplV1(dashboardService, new Logger('dashboard-routes'));

// Register Routes via Decorators Loader
registerControllers(app, [
    loginController,
    registerController,
    forgotPasswordController,
    meController,
    logoutController,
    userController,
    transactionController,
    scrapeController,
    dashboardController
]);

app.listen(PORT, () => {
    logger.info(`${MessageLib.SERVER.STARTED} ${PORT} 🚀`);
});
