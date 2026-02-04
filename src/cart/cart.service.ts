import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    async getCart(userId?: string, sessionId?: string) {
        if (!userId && !sessionId) {
            throw new BadRequestException('Either userId or sessionId is required');
        }

        let cart = await this.prisma.cart.findFirst({
            where: userId ? { userId } : { sessionId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    userId,
                    sessionId,
                },
                include: {
                    items: {
                        include: {
                            product: {
                                include: {
                                    category: true,
                                },
                            },
                        },
                    },
                },
            });
        }

        return this.calculateCartTotals(cart);
    }

    async addToCart(addToCartDto: AddToCartDto, userId?: string) {
        const { productId, quantity, sessionId } = addToCartDto;

        // Verify product exists and has stock
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.stock < quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        // Get or create cart
        let cart = await this.prisma.cart.findFirst({
            where: userId ? { userId } : { sessionId },
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    userId,
                    sessionId,
                },
            });
        }

        // Check if item already exists in cart
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });

        if (existingItem) {
            // Update quantity
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + quantity,
                },
            });
        } else {
            // Create new cart item
            await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            });
        }

        return this.getCart(userId, sessionId);
    }

    async updateCartItem(itemId: string, updateCartItemDto: UpdateCartItemDto, userId?: string, sessionId?: string) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: {
                cart: true,
                product: true,
            },
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        // Verify cart ownership
        if (userId && cartItem.cart.userId !== userId) {
            throw new BadRequestException('Unauthorized');
        }

        if (sessionId && cartItem.cart.sessionId !== sessionId) {
            throw new BadRequestException('Unauthorized');
        }

        // Check stock
        if (cartItem.product.stock < updateCartItemDto.quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        await this.prisma.cartItem.update({
            where: { id: itemId },
            data: {
                quantity: updateCartItemDto.quantity,
            },
        });

        return this.getCart(userId, sessionId);
    }

    async removeCartItem(itemId: string, userId?: string, sessionId?: string) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: {
                cart: true,
            },
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        // Verify cart ownership
        if (userId && cartItem.cart.userId !== userId) {
            throw new BadRequestException('Unauthorized');
        }

        if (sessionId && cartItem.cart.sessionId !== sessionId) {
            throw new BadRequestException('Unauthorized');
        }

        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });

        return this.getCart(userId, sessionId);
    }

    async clearCart(userId?: string, sessionId?: string) {
        const cart = await this.prisma.cart.findFirst({
            where: userId ? { userId } : { sessionId },
        });

        if (cart) {
            await this.prisma.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
        }

        return this.getCart(userId, sessionId);
    }

    private calculateCartTotals(cart: any) {
        let subtotal = 0;
        let totalDiscount = 0;

        cart.items.forEach((item: any) => {
            const product = item.product;
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            if (product.discountType === 'PERCENTAGE') {
                totalDiscount += (itemTotal * product.discountValue) / 100;
            } else if (product.discountType === 'FIXED') {
                totalDiscount += product.discountValue * item.quantity;
            }
        });

        const total = subtotal - totalDiscount;

        return {
            ...cart,
            summary: {
                subtotal,
                discount: totalDiscount,
                total,
                itemCount: cart.items.length,
            },
        };
    }
}
