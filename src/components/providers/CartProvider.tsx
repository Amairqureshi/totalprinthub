"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { PricingTier } from "@/lib/pricing/calculator";

export interface CartItem {
    id: string; // Unique ID for the cart item (timestamp + random)
    productId: string;
    productName: string;
    productImage?: string;
    productCategory: string; // e.g., "stickers", "cards", "packaging"
    productSlug: string; // URL slug for the product
    configuration: {
        quantity: number;
        paperType: string;
        size: string;
        finish: string;
        lamination?: string;
        designFile?: string | undefined; // We'll store a reference or base64 preview for now
        maskFile?: string | undefined;
        design_url?: string;
        design_url_back?: string;
        mask_url?: string;
        external_file_url?: string;
    };
    pricing: {
        unitPrice: number;
        subtotal: number;
        packagingCost: number;
        finalPrice: number;
    };
    createdAt: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, "id" | "createdAt">) => void;
    updateCartItem: (itemId: string, updates: Partial<Omit<CartItem, "id" | "createdAt">>) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("tph_cart");
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart data", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to local storage whenever cart updates
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("tph_cart", JSON.stringify(cartItems));
        }
    }, [cartItems, isInitialized]);

    const addToCart = (item: Omit<CartItem, "id" | "createdAt">) => {
        const newItem: CartItem = {
            ...item,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: Date.now(),
        };

        setCartItems((prev) => [...prev, newItem]);
        toast.success("Added to cart", {
            description: `${item.productName} (${item.configuration.quantity} units)`,
        });
    };

    const removeFromCart = (itemId: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        toast.info("Item removed from cart");
    };

    const updateCartItem = (itemId: string, updates: Partial<Omit<CartItem, "id" | "createdAt">>) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === itemId
                    ? { ...item, ...updates }
                    : item
            )
        );
        toast.success("Cart item updated");
    };

    const clearCart = () => {
        setCartItems([]);
        toast.info("Cart cleared");
    };

    const cartCount = cartItems.length;
    const cartTotal = cartItems.reduce((total, item) => total + item.pricing.finalPrice, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                updateCartItem,
                removeFromCart,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
