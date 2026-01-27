export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
    id: string;
    user_id?: string;
    email: string;
    full_name: string;
    phone: string;
    address_line1: string;
    city: string;
    pincode: string;
    status: OrderStatus;
    total_amount: number;
    created_at: string;
    updated_at: string;
    order_items?: OrderItem[]; // Nested relation
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_name: string;
    quantity: number;
    price: number;
    configuration: any;
    product_image?: string;
    created_at: string;
}

export interface CheckoutPayload {
    shippingDetails: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        pincode: string;
    };
    cartItems: any[]; // Using CartItem type from CartProvider would be better if exported specificially
    totalAmount: number;
    userId?: string;
}
