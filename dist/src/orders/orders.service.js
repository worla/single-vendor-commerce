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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createOrderDto, userId) {
        const { sessionId, items: directItems, ...orderData } = createOrderDto;
        let itemsToProcess = [];
        let cartIdToClear = null;
        if (directItems && directItems.length > 0) {
            const productIds = directItems.map((i) => i.productId);
            const products = await this.prisma.product.findMany({
                where: { id: { in: productIds } },
            });
            if (products.length !== directItems.length) {
                throw new common_1.BadRequestException('One or more products could not be found');
            }
            itemsToProcess = directItems.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    product: product,
                };
            });
        }
        else {
            const cart = await this.prisma.cart.findFirst({
                where: userId ? { userId } : { sessionId },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            if (!cart || cart.items.length === 0) {
                throw new common_1.BadRequestException('Cart is empty');
            }
            itemsToProcess = cart.items;
            cartIdToClear = cart.id;
        }
        let subtotal = 0;
        let totalDiscount = 0;
        itemsToProcess.forEach((item) => {
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
        const orderNumber = `ORD-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)
            .toUpperCase()}`;
        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                userId,
                ...orderData,
                subtotal,
                discount: totalDiscount,
                total,
                status: client_1.OrderStatus.PENDING,
                items: {
                    create: itemsToProcess.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                        discount: item.product.discountType === 'PERCENTAGE'
                            ? (item.product.price * item.product.discountValue) / 100
                            : item.product.discountType === 'FIXED'
                                ? item.product.discountValue
                                : 0,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        for (const item of itemsToProcess) {
            await this.prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }
        if (cartIdToClear) {
            await this.prisma.cartItem.deleteMany({
                where: { cartId: cartIdToClear },
            });
        }
        return order;
    }
    async findAll(userId, deliveryPersonId) {
        return this.prisma.order.findMany({
            where: {
                ...(userId && { userId }),
                ...(deliveryPersonId && { deliveryPersonId }),
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                deliveryPerson: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
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
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                deliveryPerson: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async updateStatus(id, updateOrderStatusDto) {
        await this.findOne(id);
        return this.prisma.order.update({
            where: { id },
            data: {
                status: updateOrderStatusDto.status,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    async assignDelivery(id, assignDeliveryDto) {
        await this.findOne(id);
        const deliveryPerson = await this.prisma.user.findUnique({
            where: { id: assignDeliveryDto.deliveryPersonId },
        });
        if (!deliveryPerson || deliveryPerson.role !== 'DELIVERY') {
            throw new common_1.BadRequestException('Invalid delivery person');
        }
        return this.prisma.order.update({
            where: { id },
            data: {
                deliveryPersonId: assignDeliveryDto.deliveryPersonId,
                status: client_1.OrderStatus.PROCESSING,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                deliveryPerson: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                    },
                },
            },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map