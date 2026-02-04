import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsArray,
    IsEnum,
    Min,
} from 'class-validator';
import { DiscountType } from '@prisma/client';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @Min(0)
    stock: number;

    @IsString()
    @IsNotEmpty()
    mainImage: string;

    @IsArray()
    @IsString({ each: true })
    supportingImages: string[];

    @IsString()
    @IsNotEmpty()
    categoryId: string;

    @IsOptional()
    @IsEnum(DiscountType)
    discountType?: DiscountType;

    @IsOptional()
    @IsNumber()
    @Min(0)
    discountValue?: number;
}

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;

    @IsOptional()
    @IsString()
    mainImage?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    supportingImages?: string[];

    @IsOptional()
    @IsString()
    categoryId?: string;

    @IsOptional()
    @IsEnum(DiscountType)
    discountType?: DiscountType;

    @IsOptional()
    @IsNumber()
    @Min(0)
    discountValue?: number;
}

export class ApplyDiscountDto {
    @IsEnum(DiscountType)
    discountType: DiscountType;

    @IsNumber()
    @Min(0)
    discountValue: number;
}
