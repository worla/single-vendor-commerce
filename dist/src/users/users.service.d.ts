import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateAddressDto } from './dto/create-address.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(role?: string): Promise<UserResponseDto[]>;
    findOne(id: string): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<UserResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        totalUsers: number;
        buyers: number;
        deliveryPersons: number;
        admins: number;
    }>;
    addAddress(userId: string, dto: CreateAddressDto): Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        street: string;
        city: string;
        region: string | null;
        isDefault: boolean;
    }>;
    removeAddress(userId: string, addressId: string): Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        street: string;
        city: string;
        region: string | null;
        isDefault: boolean;
    }>;
    private sanitizeUser;
}
