import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class AddToCartDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsOptional()
    @IsString()
    sessionId?: string; // For guest users
}

export class UpdateCartItemDto {
    @IsNumber()
    @Min(1)
    quantity: number;
}
