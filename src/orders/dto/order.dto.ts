import {
    IsString,
    IsNotEmpty,
    IsEmail,
    IsOptional,
    IsEnum,
} from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    customerName: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    customerEmail: string;

    @ApiProperty({ example: '+1234567890' })
    @IsString()
    @IsNotEmpty()
    customerPhone: string;

    @ApiProperty({ example: '123 Main St, New York, NY 10001' })
    @IsString()
    @IsNotEmpty()
    shippingAddress: string;

    @ApiProperty({ example: 'session-123', required: false })
    @IsOptional()
    @IsString()
    sessionId?: string; // For guest checkout

    @ApiProperty({ type: 'array', required: false, example: [{ productId: '1', quantity: 1 }] })
    @IsOptional()
    items?: CreateOrderItemDto[];
}

export class CreateOrderItemDto {
    @ApiProperty({ example: 'product-uuid' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    quantity: number;
}

export class UpdateOrderStatusDto {
    @ApiProperty({ enum: OrderStatus })
    @IsEnum(OrderStatus)
    status: OrderStatus;
}

export class AssignDeliveryDto {
    @ApiProperty({ example: 'user-uuid-123' })
    @IsString()
    @IsNotEmpty()
    deliveryPersonId: string;
}
