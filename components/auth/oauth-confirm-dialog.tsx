"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

type Provider = "google" | "microsoft" | "x";

const providerNames: Record<Provider, string> = {
  google: "Google",
  microsoft: "Microsoft",
  x: "X (Twitter)",
};

const providerEmails: Record<Provider, string> = {
  google: "user@gmail.com",
  microsoft: "user@outlook.com",
  x: "user@x.com",
};

interface OAuthConfirmDialogProps {
  open: boolean;
  provider: Provider | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function OAuthConfirmDialog({
  open,
  provider,
  onConfirm,
  onCancel,
}: OAuthConfirmDialogProps) {
  // provider null ise dialog'u gösterme
  if (!provider) return null;

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirm();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onCancel(); }}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center sm:text-center">
          <motion.div
            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <AlertCircle className="w-6 h-6 text-primary" />
          </motion.div>
          <DialogTitle>Demo Modu</DialogTitle>
          <DialogDescription className="text-center">
            Bu bir demo uygulamasıdır. Gerçek {providerNames[provider]} OAuth
            entegrasyonu için backend sunucusu gereklidir.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-3 text-center text-sm">
          Demo hesabı ile devam ederseniz,{" "}
          <strong className="text-foreground">{providerEmails[provider]}</strong>{" "}
          olarak giriş yapacaksınız.
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            İptal
          </Button>
          <Button onClick={handleConfirm} className="flex-1">
            Demo ile Devam Et
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
