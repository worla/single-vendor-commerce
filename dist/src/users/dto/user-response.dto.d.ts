import { UserRole } from '@prisma/client';
export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<UserResponseDto>);
}
