import { OrderStatus } from '@prisma/client';
export declare class CreateOrderDto {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    sessionId?: string;
    items?: CreateOrderItemDto[];
}
export declare class CreateOrderItemDto {
    productId: string;
    quantity: number;
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
}
export declare class AssignDeliveryDto {
    deliveryPersonId: string;
}
