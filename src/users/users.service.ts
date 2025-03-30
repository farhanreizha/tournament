import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { PrismaService } from "@/common/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserResponse } from "./dto/user.dto";
import { Role } from "@prisma/client";
import { hash } from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}

  // TODO: make other query like create, findAll, findOne, delete

  async update(
    userId: string,
    req,
    updateUser?: UpdateUserDto,
    role?: Role,
  ): Promise<UserResponse> {
    this.logger.debug("Updating user roles or details");

    // [ ]: coba liat lagi takut masih ada yang kurang atau salah buat updatenya
    // [x]: update user done

    const { userRole, userId: requesterId } = req;
    const isAdmin = userRole === Role.ADMIN;
    const isOwnAccount = userId === requesterId;

    if (role && (!isAdmin || isOwnAccount)) {
      throw new ForbiddenException(
        isAdmin
          ? "You cannot change your own role"
          : "You are not authorized to change roles",
      );
    }

    if (updateUser?.password) {
      updateUser.password = await hash(updateUser.password, 10);
    }

    const updateData = isAdmin ? { role } : { ...updateUser, role: undefined };

    try {
      const user = await this.prismaService.user.update({
        where: { id: userId },
        data: updateData,
      });

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error.code === "P2002") {
      const conflictField = error.meta?.target;
      const split = conflictField.split("_")[1];
      const field = split.charAt(0).toUpperCase() + split.slice(1);
      throw new ForbiddenException(`${field} already exists`);
    }
    if (error.code === "P2025") {
      throw new NotFoundException("User not found");
    }
    throw error;
  }

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
