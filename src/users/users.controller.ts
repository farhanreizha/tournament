import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";
import { Roles } from "@/common/decorator/role.decorator";
import { AuthGuard } from "@/common/guards/auth.guard";
import { RolesGuard } from "@/common/guards/role.guard";
import { ErrorResponse } from "@/dtos/response-web.dto";
import { Role } from "@prisma/client";
import { UserResponse } from "./dto/user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

// TODO: make other endpoint like create, findAll, findOne, and delete
// [ ]: tolong check juga swagger nya yak
// [x]: swagger & endpoint update done
// XXX: yang harusnya beres semua gara gara swagger jadi stuck di 1 endpoint sama 1 query doang bangke 😤

@ApiBearerAuth()
@ApiNotFoundResponse({
  description: "Not Found",
  type: ErrorResponse,
})
@Controller("api/users")
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.PLAYER, Role.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Update User" })
  @ApiOkResponse({
    description: "Successfully Update User",
    type: UserResponse,
  })
  @ApiBadRequestResponse({
    description: "Bad Request",
    type: ErrorResponse,
  })
  @Patch(":id")
  @HttpCode(200)
  @ApiBody({
    type: UpdateUserDto,
    required: false,
  })
  @ApiQuery({
    name: "role",
    enum: Role,
    required: false,
  })
  async update(
    @Req() req,
    @Param("id") id: string,
    @Body() userUpdate?: UpdateUserDto,
    @Query("role") role?: Role,
  ): Promise<UserResponse> {
    return await this.usersService.update(id, req, userUpdate, role);
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @ApiOperation({ summary: "Update User" })
  // @ApiOkResponse({
  //   description: "Successfully Update User",
  //   type: UserResponse,
  // })
  // @ApiBadRequestResponse({
  //   description: "Bad Request",
  //   type: ErrorResponse,
  // })
  // @Patch("change-role")
  // @HttpCode(200)
  // @Roles(Role.ADMIN)
  // async changeUserRole(
  //   @Req() req,
  //   @Param("id") id: string,
  //   @Body() updateUserRole: UpdateUserRoleDto,
  // ): Promise<UserResponse> {
  //   return await this.usersService.changeUserRole(updateUserRole, req.);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
