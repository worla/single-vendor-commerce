import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, AssignDeliveryDto } from './dto/order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto, user: any, sessionId?: string): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            productId: string;
            quantity: number;
            discount: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        shippingAddress: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        deliveryPersonId: string | null;
        orderNumber: string;
        subtotal: number;
        discount: number;
        total: number;
    }>;
    findAll(user: any, deliveryPersonId?: string): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            productId: string;
            quantity: number;
            discount: number;
            orderId: string;
        })[];
        deliveryPerson: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        shippingAddress: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        deliveryPersonId: string | null;
        orderNumber: string;
        subtotal: number;
        discount: number;
        total: number;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            productId: string;
            quantity: number;
            discount: number;
            orderId: string;
        })[];
        deliveryPerson: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        shippingAddress: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        deliveryPersonId: string | null;
        orderNumber: string;
        subtotal: number;
        discount: number;
        total: number;
    }>;
    updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            productId: string;
            quantity: number;
            discount: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        shippingAddress: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        deliveryPersonId: string | null;
        orderNumber: string;
        subtotal: number;
        discount: number;
        total: number;
    }>;
    assignDelivery(id: string, assignDeliveryDto: AssignDeliveryDto): Promise<{
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            price: number;
            productId: string;
            quantity: number;
            discount: number;
            orderId: string;
        })[];
        deliveryPerson: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        shippingAddress: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        deliveryPersonId: string | null;
        orderNumber: string;
        subtotal: number;
        discount: number;
        total: number;
    }>;
}
