import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    /**
     * Get all users with optional filtering
     */
    async findAll(role?: string): Promise<UserResponseDto[]> {
        const users = await this.prisma.user.findMany({
            where: role ? { role: role as any } : undefined,
            orderBy: { createdAt: 'desc' },
        });

        return users.map((user) => this.sanitizeUser(user));
    }

    /**
     * Get a single user by ID
     */
    async findOne(id: string): Promise<UserResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                addresses: true,
                _count: {
                    select: {
                        orders: true,
                        deliveryOrders: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return this.sanitizeUser(user);
    }

    /**
     * Update user information
     */
    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // If email is being updated, check if it's already taken
        if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
            const emailExists = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            });

            if (emailExists) {
                throw new ConflictException('Email already in use');
            }
        }

        // Hash password if it's being updated
        const updateData: any = { ...updateUserDto };
        if (updateUserDto.password) {
            updateData.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
        });

        return this.sanitizeUser(updatedUser);
    }

    /**
     * Update user role
     */
    async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<UserResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { role: updateRoleDto.role },
        });

        return this.sanitizeUser(updatedUser);
    }

    /**
     * Delete a user
     */
    async remove(id: string): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // Prevent deleting admin users (optional safety check)
        if (user.role === 'ADMIN') {
            throw new BadRequestException('Cannot delete admin users');
        }

        await this.prisma.user.delete({
            where: { id },
        });

        return { message: `User ${user.email} has been deleted successfully` };
    }

    /**
     * Get user statistics
     */
    async getStats() {
        const [totalUsers, buyers, deliveryPersons, admins] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { role: 'BUYER' } }),
            this.prisma.user.count({ where: { role: 'DELIVERY' } }),
            this.prisma.user.count({ where: { role: 'ADMIN' } }),
        ]);

        return {
            totalUsers,
            buyers,
            deliveryPersons,
            admins,
        };
    }

    /**
     * Add an address to a user
     */
    async addAddress(userId: string, dto: CreateAddressDto) {
        if (dto.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        return this.prisma.address.create({
            data: {
                ...dto,
                userId,
            },
        });
    }

    /**
     * Delete an address
     */
    async removeAddress(userId: string, addressId: string) {
        const address = await this.prisma.address.findUnique({
            where: { id: addressId },
        });

        if (!address || address.userId !== userId) {
            throw new NotFoundException('Address not found');
        }

        return this.prisma.address.delete({
            where: { id: addressId },
        });
    }

    /**
     * Remove sensitive fields from user object
     */
    private sanitizeUser(user: any): UserResponseDto {
        const { password, refreshToken, ...sanitized } = user;
        return new UserResponseDto(sanitized);
    }
}
