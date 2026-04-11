import { Request, Response } from "express";
import { TransactionControllerV1 } from "../TransactionControllerV1";
import { TransactionServiceImplV1 } from "../../../service/v1/impl/TransactionServiceImplV1";
import { RoleEnum } from "../../../utils";
import { Logger } from "../../../config/logging/Logging";
import { AuthorizationRoleMiddleware, JwtAuthFilter } from "../../../config";
import { BaseController, GetEndpoint, PostEndpoint } from "../../../annotations";

@BaseController('/api/v1/transactions')
export class TransactionControllerImplV1 implements TransactionControllerV1 {
    constructor(
        private transactionService: TransactionServiceImplV1,
        private logger: Logger
    ) {}

    @GetEndpoint('/', [JwtAuthFilter, AuthorizationRoleMiddleware([RoleEnum.ADMIN])])
    async getAllTransactions(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.transactionService.findAll();
            this.logger.info("Successfully fetched all transactions");
            res.status(200).json(response);
        } catch (error: any) {
            this.logger.error(error.message);
            res.status(500).json({ message: error.message });
        }
    }

    @PostEndpoint('/:id/approve', [JwtAuthFilter, AuthorizationRoleMiddleware([RoleEnum.ADMIN])])
    async approveTransaction(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const response = await this.transactionService.approve(id);
            if (!response) {
                res.status(404).json({ message: 'Transaction not found' });
                return;
            }
            this.logger.info(`Transaction ${id} approved`);
            res.status(200).json(response);
        } catch (error: any) {
            this.logger.error(error.message);
            res.status(500).json({ message: error.message });
        }
    }

    @PostEndpoint('/:id/reject', [JwtAuthFilter, AuthorizationRoleMiddleware([RoleEnum.ADMIN])])
    async rejectTransaction(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const response = await this.transactionService.reject(id);
            if (!response) {
                res.status(404).json({ message: 'Transaction not found' });
                return;
            }
            this.logger.info(`Transaction ${id} rejected`);
            res.status(200).json(response);
        } catch (error: any) {
            this.logger.error(error.message);
            res.status(500).json({ message: error.message });
        }
    }

    @PostEndpoint('/subscribe', [JwtAuthFilter, AuthorizationRoleMiddleware([RoleEnum.USER, RoleEnum.ADMIN])])
    async subscribe(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore
            const userId = req.user?.id; // Assuming user info is injected by JwtAuthFilter
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const response = await this.transactionService.subscribe(userId);
            this.logger.info(`User ${userId} subscribed`);
            res.status(201).json(response);
        } catch (error: any) {
            this.logger.error(error.message);
            res.status(500).json({ message: error.message });
        }
    }

    @GetEndpoint('/me', [JwtAuthFilter, AuthorizationRoleMiddleware([RoleEnum.USER, RoleEnum.ADMIN])])
    async getMyTransactions(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const response = await this.transactionService.findByUserId(userId);
            this.logger.info(`Successfully fetched transactions for user ${userId}`);
            res.status(200).json(response);
        } catch (error: any) {
            this.logger.error(error.message);
            res.status(500).json({ message: error.message });
        }
    }
}
