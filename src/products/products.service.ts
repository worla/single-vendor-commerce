import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CreateProductDto,
    UpdateProductDto,
    ApplyDiscountDto,
} from './dto/product.dto';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto) {
        return this.prisma.product.create({
            data: createProductDto,
            include: {
                category: true,
            },
        });
    }

    async findAll(categoryId?: string) {
        return this.prisma.product.findMany({
            where: categoryId ? { categoryId } : {},
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        await this.findOne(id); // Check if exists

        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
            include: {
                category: true,
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id); // Check if exists

        return this.prisma.product.delete({
            where: { id },
        });
    }

    async applyDiscount(id: string, applyDiscountDto: ApplyDiscountDto) {
        await this.findOne(id); // Check if exists

        return this.prisma.product.update({
            where: { id },
            data: {
                discountType: applyDiscountDto.discountType,
                discountValue: applyDiscountDto.discountValue,
            },
            include: {
                category: true,
            },
        });
    }

    calculateDiscountedPrice(price: number, discountType: string, discountValue: number): number {
        if (discountType === 'PERCENTAGE') {
            return price - (price * discountValue) / 100;
        } else if (discountType === 'FIXED') {
            return Math.max(0, price - discountValue);
        }
        return price;
    }
}
