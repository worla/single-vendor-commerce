"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId, sessionId) {
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Either userId or sessionId is required');
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
    async addToCart(addToCartDto, userId) {
        const { productId, quantity, sessionId } = addToCartDto;
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.stock < quantity) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
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
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });
        if (existingItem) {
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + quantity,
                },
            });
        }
        else {
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
    async updateCartItem(itemId, updateCartItemDto, userId, sessionId) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: {
                cart: true,
                product: true,
            },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (userId && cartItem.cart.userId !== userId) {
            throw new common_1.BadRequestException('Unauthorized');
        }
        if (sessionId && cartItem.cart.sessionId !== sessionId) {
            throw new common_1.BadRequestException('Unauthorized');
        }
        if (cartItem.product.stock < updateCartItemDto.quantity) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        await this.prisma.cartItem.update({
            where: { id: itemId },
            data: {
                quantity: updateCartItemDto.quantity,
            },
        });
        return this.getCart(userId, sessionId);
    }
    async removeCartItem(itemId, userId, sessionId) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: {
                cart: true,
            },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (userId && cartItem.cart.userId !== userId) {
            throw new common_1.BadRequestException('Unauthorized');
        }
        if (sessionId && cartItem.cart.sessionId !== sessionId) {
            throw new common_1.BadRequestException('Unauthorized');
        }
        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });
        return this.getCart(userId, sessionId);
    }
    async clearCart(userId, sessionId) {
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
    calculateCartTotals(cart) {
        let subtotal = 0;
        let totalDiscount = 0;
        cart.items.forEach((item) => {
            const product = item.product;
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;
            if (product.discountType === 'PERCENTAGE') {
                totalDiscount += (itemTotal * product.discountValue) / 100;
            }
            else if (product.discountType === 'FIXED') {
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
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map