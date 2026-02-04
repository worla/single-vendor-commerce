import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ApplyDiscountDto } from './dto/product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            image: string;
            bannerImage: string;
            description: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: number;
        stock: number;
        mainImage: string;
        supportingImages: string[];
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountValue: number;
        categoryId: string;
    }>;
    findAll(categoryId?: string): Promise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            image: string;
            bannerImage: string;
            description: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: number;
        stock: number;
        mainImage: string;
        supportingImages: string[];
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountValue: number;
        categoryId: string;
    })[]>;
    findOne(id: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            image: string;
            bannerImage: string;
            description: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: number;
        stock: number;
        mainImage: string;
        supportingImages: string[];
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountValue: number;
        categoryId: string;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            image: string;
            bannerImage: string;
            description: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: number;
        stock: number;
        mainImage: string;
        supportingImages: string[];
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountValue: number;
        categoryId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: number;
        stock: number;
        mainImage: string;
        supportingImages: string[];
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountValue: number;
        categoryId: string;
    }>;
    applyDiscount(id: string, applyDiscountDto: ApplyDiscountDto): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            image: string;
            bannerImage: string;
            description: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        price: number;
        stock: number;
        mainImage: string;
        supportingImages: string[];
        discountType: import(".prisma/client").$Enums.DiscountType;
        discountValue: number;
        categoryId: string;
    }>;
    calculateDiscountedPrice(price: number, discountType: string, discountValue: number): number;
}
