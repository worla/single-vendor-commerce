import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ApplyDiscountDto } from './dto/product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
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
}
