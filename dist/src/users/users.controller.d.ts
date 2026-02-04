import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UserResponseDto } from './dto/user-response.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(role?: string): Promise<UserResponseDto[]>;
    getStats(): Promise<{
        totalUsers: number;
        buyers: number;
        deliveryPersons: number;
        admins: number;
    }>;
    findOne(id: string, user: any): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto, user: any): Promise<UserResponseDto>;
    addAddress(id: string, createAddressDto: CreateAddressDto, user: any): Promise<{
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
    removeAddress(id: string, addressId: string, user: any): Promise<{
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
    updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<UserResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
