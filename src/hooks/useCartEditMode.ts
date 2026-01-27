"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import type { CartItem } from "@/components/providers/CartProvider";

export function useCartEditMode() {
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<CartItem | null>(null);
    const { cartItems } = useCart();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const editId = params.get('edit');

            if (editId) {
                setEditingItemId(editId);
                const itemToEdit = cartItems.find(item => item.id === editId);
                if (itemToEdit) {
                    setEditingItem(itemToEdit);
                }
            }
        }
    }, [cartItems]);

    return { editingItemId, editingItem, isEditMode: !!editingItemId };
}
