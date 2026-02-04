import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UpdateRoleDto {
    @ApiProperty({
        enum: UserRole,
        example: UserRole.DELIVERY,
        description: 'New role for the user (ADMIN, BUYER, or DELIVERY)'
    })
    @IsEnum(UserRole)
    role: UserRole;
}
