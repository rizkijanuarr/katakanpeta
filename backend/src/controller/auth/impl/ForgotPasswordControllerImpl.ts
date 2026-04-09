import { Request, Response } from "express";
import { ForgotPasswordController } from "../ForgotPasswordController";
import { ForgotPasswordService } from "../../../service/auth/ForgotPasswordService";
import { ForgotPasswordServiceImpl } from "../../../service/auth/impl/ForgotPasswordServiceImpl";
import { BaseController, PostEndpoint } from '../../../annotations';
import { ResponseHelper } from "../../../response";

@BaseController('/api/v1/auth')
export class ForgotPasswordControllerImpl implements ForgotPasswordController {
  private forgotPasswordService: ForgotPasswordService;

  constructor() {
    this.forgotPasswordService = new ForgotPasswordServiceImpl();
  }

  @PostEndpoint('/forgot-password')
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json(ResponseHelper.error('Email is required'));
        return;
      }

      const result = await this.forgotPasswordService.initiateReset({ email });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json(ResponseHelper.error(error.message || 'Failed to initiate password reset'));
    }
  }
}
