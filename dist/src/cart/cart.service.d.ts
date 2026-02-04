import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(userId?: string, sessionId?: string): Promise<any>;
    addToCart(addToCartDto: AddToCartDto, userId?: string): Promise<any>;
    updateCartItem(itemId: string, updateCartItemDto: UpdateCartItemDto, userId?: string, sessionId?: string): Promise<any>;
    removeCartItem(itemId: string, userId?: string, sessionId?: string): Promise<any>;
    clearCart(userId?: string, sessionId?: string): Promise<any>;
    private calculateCartTotals;
}
