"use client";

import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, Pencil } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export function CartSheet() {
    const { cartItems, removeFromCart, cartTotal, cartCount } = useCart();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    {cartCount > 0 && (
                        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                            {cartCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="px-1">
                    <SheetTitle>My Cart ({cartCount})</SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex-1 pr-6">
                    {cartItems.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-2 py-16">
                            <ShoppingBag className="h-12 w-12 text-gray-300" />
                            <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
                            <p className="text-sm text-gray-500">
                                Looks like you haven't added anything yet.
                            </p>
                            <Button className="mt-4" variant="secondary" asChild>
                                <Link href="/products">Browse Products</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6 pt-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex space-x-4">
                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        {item.productImage ? (
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="h-full w-full object-contain object-center"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-gray-50 text-xs text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <div>
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3>{item.productName}</h3>
                                                <p className="ml-4">{formatPrice(item.pricing.finalPrice)}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500 capitalize">
                                                {item.configuration.quantity} units • {item.configuration.paperType}
                                            </p>
                                        </div>
                                        <div className="flex flex-1 items-end justify-between text-sm">
                                            <p className="text-gray-500">
                                                {item.configuration.size.toUpperCase()}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-500 hover:bg-blue-50"
                                                    asChild
                                                >
                                                    <Link href={`/products/${item.productCategory}/${item.productSlug}?edit=${item.id}`}>
                                                        <Pencil className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-500"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                {cartItems.length > 0 && (
                    <SheetFooter className="border-t border-gray-200 pt-6 pr-6 mt-auto">
                        <div className="w-full space-y-4">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                                <p>Subtotal</p>
                                <p>{formatPrice(cartTotal)}</p>
                            </div>
                            <p className="text-xs text-gray-500">
                                Shipping and taxes calculated at checkout.
                            </p>
                            <Button className="w-full" size="lg" asChild>
                                <Link href="/checkout">Checkout</Link>
                            </Button>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
