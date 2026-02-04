import { DiscountType } from '@prisma/client';
export declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    mainImage: string;
    supportingImages: string[];
    categoryId: string;
    discountType?: DiscountType;
    discountValue?: number;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    mainImage?: string;
    supportingImages?: string[];
    categoryId?: string;
    discountType?: DiscountType;
    discountValue?: number;
}
export declare class ApplyDiscountDto {
    discountType: DiscountType;
    discountValue: number;
}
