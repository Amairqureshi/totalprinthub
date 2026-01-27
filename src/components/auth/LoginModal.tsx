"use client";

import { AuthForm } from "./AuthForm";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function LoginModal({ open, onOpenChange, onSuccess }: LoginModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <AuthForm
                    initialMode="login"
                    onSuccess={() => {
                        onSuccess?.();
                        // Optional: close on success if magic link redirect isn't immediate
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
