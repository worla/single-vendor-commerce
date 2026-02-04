import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(user: any, sessionId?: string): Promise<any>;
    addToCart(addToCartDto: AddToCartDto, user: any, sessionId?: string): Promise<any>;
    updateCartItem(id: string, updateCartItemDto: UpdateCartItemDto, user: any, sessionId?: string): Promise<any>;
    removeCartItem(id: string, user: any, sessionId?: string): Promise<any>;
    clearCart(user: any, sessionId?: string): Promise<any>;
}
