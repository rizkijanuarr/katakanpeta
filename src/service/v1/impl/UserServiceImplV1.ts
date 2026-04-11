import bcrypt from "bcrypt";
import { UserServiceV1 } from "../..";
import { UserRequestV1 } from "../../../request";
import { ListUserResponseV1, ResponseHelper, UserApiResponse } from "../../../response";
import { MessageLib } from "../../../utils";
import { Logger } from "../../../config/logging/Logging";
import { UserRepositoryV1 } from "../../../repositories";
import { toUserDTO } from "../../../dtos/UserDTO";

export class UserServiceImplV1 implements UserServiceV1 {
    private userRepositoryV1: UserRepositoryV1;

    constructor(private Logger: Logger) {
        this.userRepositoryV1 = new UserRepositoryV1();
    }

    async createUser(request: UserRequestV1): Promise<UserApiResponse> {
        const { name, email, password, role } = request;

        const existingUser = await this.userRepositoryV1.findOneByEmail(email);
        if (existingUser) {
            this.Logger.error(MessageLib.AUTH.USER_ALREADY_EXISTS);
            throw new Error(MessageLib.AUTH.USER_ALREADY_EXISTS);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await this.userRepositoryV1.createUser({
            name,
            email,
            password: hashedPassword,
            role,
            createdBy: "SYSTEM"
        });

        return ResponseHelper.success(
            MessageLib.AUTH.USER_REGISTERED_SUCCESSFULLY,
            toUserDTO(newUser)
        );
    }

    async getAllUsers(): Promise<ListUserResponseV1> {
        const users = await this.userRepositoryV1.findAll();
        const responses = users.map(toUserDTO);
        this.Logger.info(MessageLib.USER.USER_RETRIEVED);

        return {
            success: true,
            message: MessageLib.USER.USER_RETRIEVED,
            data: responses,
        };
    }

    async getUserById(id: string): Promise<UserApiResponse> {
        const user = await this.userRepositoryV1.findById(id);
        if (!user) {
            this.Logger.error(MessageLib.USER.USER_NOT_FOUND);
            throw new Error(MessageLib.USER.USER_NOT_FOUND);
        }

        return ResponseHelper.success(
            MessageLib.USER.USER_RETRIEVED,
            toUserDTO(user)
        );
    }

    async updateUser(id: string, request: UserRequestV1): Promise<UserApiResponse> {
        const updatedUser = await this.userRepositoryV1.updateUser(id, request);
        if (!updatedUser) {
            this.Logger.error(MessageLib.USER.USER_UPDATE_FAILED);
            throw new Error(MessageLib.USER.USER_UPDATE_FAILED);
        }

        this.Logger.info(MessageLib.USER.USER_UPDATED);

        return ResponseHelper.success(
            MessageLib.USER.USER_UPDATED,
            toUserDTO(updatedUser)
        );
    }

    async deleteUser(id: string): Promise<{ message: string }> {
        const deletedUser = await this.userRepositoryV1.deleteUser(id);
        if (!deletedUser) {
            this.Logger.error(MessageLib.USER.USER_NOT_FOUND);
            throw new Error(MessageLib.USER.USER_NOT_FOUND);
        }

        this.Logger.info(MessageLib.USER.USER_DELETED);
        return { message: MessageLib.USER.USER_DELETED };
    }
}
