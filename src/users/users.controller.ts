import {
    Controller,
    Get,
    Put,
    Delete,
    Patch,
    Body,
    Param,
    Query,
    UseGuards,
    ForbiddenException,
    Post,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all users (Admin only)' })
    @ApiQuery({
        name: 'role',
        required: false,
        enum: UserRole,
        description: 'Filter users by role',
    })
    @ApiResponse({
        status: 200,
        description: 'List of all users',
        type: [UserResponseDto],
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async findAll(@Query('role') role?: string): Promise<UserResponseDto[]> {
        return this.usersService.findAll(role);
    }

    @Get('stats')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get user statistics (Admin only)' })
    @ApiResponse({
        status: 200,
        description: 'User statistics',
        schema: {
            type: 'object',
            properties: {
                totalUsers: { type: 'number' },
                buyers: { type: 'number' },
                deliveryPersons: { type: 'number' },
                admins: { type: 'number' },
            },
        },
    })
    async getStats() {
        return this.usersService.getStats();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID (Admin or Owner)' })
    @ApiResponse({
        status: 200,
        description: 'User details',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(
        @Param('id') id: string,
        @GetUser() user: any,
    ): Promise<UserResponseDto> {
        if (user.role !== UserRole.ADMIN && user.id !== id) {
            throw new ForbiddenException('You can only view your own profile');
        }
        return this.usersService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user information (Admin or Owner)' })
    @ApiResponse({
        status: 200,
        description: 'User updated successfully',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 409, description: 'Email already in use' })
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @GetUser() user: any,
    ): Promise<UserResponseDto> {
        if (user.role !== UserRole.ADMIN && user.id !== id) {
            throw new ForbiddenException('You can only update your own profile');
        }
        return this.usersService.update(id, updateUserDto);
    }

    @Post(':id/addresses')
    @ApiOperation({ summary: 'Add a new address' })
    async addAddress(
        @Param('id') id: string,
        @Body() createAddressDto: CreateAddressDto,
        @GetUser() user: any,
    ) {
        if (user.role !== UserRole.ADMIN && user.id !== id) {
            throw new ForbiddenException('You can only update your own profile');
        }
        return this.usersService.addAddress(id, createAddressDto);
    }

    @Delete(':id/addresses/:addressId')
    @ApiOperation({ summary: 'Delete an address' })
    async removeAddress(
        @Param('id') id: string,
        @Param('addressId') addressId: string,
        @GetUser() user: any,
    ) {
        if (user.role !== UserRole.ADMIN && user.id !== id) {
            throw new ForbiddenException('You can only update your own profile');
        }
        return this.usersService.removeAddress(id, addressId);
    }

    @Patch(':id/role')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Change user role (Admin only)' })
    @ApiResponse({
        status: 200,
        description: 'User role updated successfully',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updateRole(
        @Param('id') id: string,
        @Body() updateRoleDto: UpdateRoleDto,
    ): Promise<UserResponseDto> {
        return this.usersService.updateRole(id, updateRoleDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete user (Admin only)' })
    @ApiResponse({
        status: 200,
        description: 'User deleted successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 400, description: 'Cannot delete admin users' })
    async remove(@Param('id') id: string): Promise<{ message: string }> {
        return this.usersService.remove(id);
    }
}
