import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CreateOrderDto,
    UpdateOrderStatusDto,
    AssignDeliveryDto,
} from './dto/order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async create(createOrderDto: CreateOrderDto, userId?: string) {
        const { sessionId, items: directItems, ...orderData } = createOrderDto;

        let itemsToProcess: any[] = [];
        let cartIdToClear: string | null = null;

        if (directItems && directItems.length > 0) {
            // Scenario 1: Direct Items Provided (e.g. Guest Checkout from Local Cart)
            const productIds = directItems.map((i) => i.productId);
            const products = await this.prisma.product.findMany({
                where: { id: { in: productIds } },
            });

            if (products.length !== directItems.length) {
                throw new BadRequestException('One or more products could not be found');
            }

            itemsToProcess = directItems.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    product: product,
                };
            });
        } else {
            // Scenario 2: Use Database Cart (e.g. Logged-in User)
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
                throw new BadRequestException('Cart is empty');
            }
            itemsToProcess = cart.items;
            cartIdToClear = cart.id;
        }

        // Calculate totals
        let subtotal = 0;
        let totalDiscount = 0;

        itemsToProcess.forEach((item) => {
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

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)
            .toUpperCase()}`;

        // Create order
        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                userId,
                ...orderData,
                subtotal,
                discount: totalDiscount,
                total,
                status: OrderStatus.PENDING,
                items: {
                    create: itemsToProcess.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                        discount:
                            item.product.discountType === 'PERCENTAGE'
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

        // Update product stock
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

        // Clear cart (only if we used DB cart)
        if (cartIdToClear) {
            await this.prisma.cartItem.deleteMany({
                where: { cartId: cartIdToClear },
            });
        }

        return order;
    }

    async findAll(userId?: string, deliveryPersonId?: string) {
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

    async findOne(id: string) {
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
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        return order;
    }

    async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
        await this.findOne(id); // Check if exists

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

    async assignDelivery(id: string, assignDeliveryDto: AssignDeliveryDto) {
        await this.findOne(id); // Check if exists

        // Verify delivery person exists and has correct role
        const deliveryPerson = await this.prisma.user.findUnique({
            where: { id: assignDeliveryDto.deliveryPersonId },
        });

        if (!deliveryPerson || deliveryPerson.role !== 'DELIVERY') {
            throw new BadRequestException('Invalid delivery person');
        }

        return this.prisma.order.update({
            where: { id },
            data: {
                deliveryPersonId: assignDeliveryDto.deliveryPersonId,
                status: OrderStatus.PROCESSING,
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
}
