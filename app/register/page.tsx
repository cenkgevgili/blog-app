"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { OAuthConfirmDialog } from "@/components/auth/oauth-confirm-dialog";
import {
  registerWithEmail,
  loginWithGoogle,
  loginWithMicrosoft,
  loginWithX,
} from "@/lib/auth";
import { User, Mail, Lock, ArrowRight, Check } from "lucide-react";

type Provider = "google" | "microsoft" | "x";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [oauthDialog, setOauthDialog] = useState<{
    open: boolean;
    provider: Provider | null;
  }>({ open: false, provider: null });

  const passwordRequirements = [
    { label: "En az 8 karakter", met: password.length >= 8 },
    { label: "Bir büyük harf", met: /[A-Z]/.test(password) },
    { label: "Bir rakam", met: /[0-9]/.test(password) },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!name || !email || !password || !confirmPassword) {
        throw new Error("Lütfen tüm alanları doldurun");
      }
      if (password !== confirmPassword) {
        throw new Error("Şifreler eşleşmiyor");
      }
      if (password.length < 8) {
        throw new Error("Şifre en az 8 karakter olmalı");
      }
      registerWithEmail(name, email, password);
      // Hard navigation ile ana sayfaya git
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
      setIsLoading(false);
    }
  };

  const handleOAuthClick = (provider: Provider) => {
    setOauthDialog({ open: true, provider });
  };

  const handleOAuthConfirm = () => {
    const { provider } = oauthDialog;
    if (!provider) return;

    // Önce login işlemini yap
    if (provider === "google") loginWithGoogle();
    else if (provider === "microsoft") loginWithMicrosoft();
    else if (provider === "x") loginWithX();
    
    // Sonra hard navigation ile ana sayfaya git
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 py-12">
      {/* OAuth Confirmation Dialog */}
      <OAuthConfirmDialog
        open={oauthDialog.open}
        provider={oauthDialog.provider}
        onConfirm={handleOAuthConfirm}
        onCancel={() => setOauthDialog({ open: false, provider: null })}
      />

      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 -z-10" />
      <motion.div
        className="fixed bottom-20 right-[10%] w-96 h-96 rounded-full bg-accent/10 blur-3xl -z-10"
        animate={{ y: [0, -40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 shadow-xl shadow-primary/5">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-block mb-6">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto"
                  whileHover={{ rotate: 12 }}
                >
                  <span className="text-primary-foreground font-bold text-xl">
                    B
                  </span>
                </motion.div>
              </Link>
              <h1 className="text-2xl font-bold tracking-tight mb-2">
                Hesap Oluştur
              </h1>
              <p className="text-muted-foreground text-sm">
                Yazar ol ve düşüncelerini paylaş
              </p>
            </div>

            {/* OAuth Buttons */}
            <OAuthButtons
              onGoogle={() => handleOAuthClick("google")}
              onMicrosoft={() => handleOAuthClick("microsoft")}
              onX={() => handleOAuthClick("x")}
              isLoading={isLoading}
            />

            {/* Divider */}
            <div className="relative my-8">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-xs text-muted-foreground">
                veya email ile
              </span>
            </div>

            {/* Register Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Adınız Soyadınız"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-11"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11"
                    disabled={isLoading}
                  />
                </div>
                {/* Password Requirements */}
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-1 pt-2"
                  >
                    {passwordRequirements.map((req, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 text-xs ${
                          req.met ? "text-green-600" : "text-muted-foreground"
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 ${req.met ? "opacity-100" : "opacity-30"}`}
                        />
                        {req.label}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="submit"
                  className="w-full h-11 gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>

              <p className="text-xs text-muted-foreground text-center">
                Kayıt olarak{" "}
                <Link href="#" className="text-primary hover:underline">
                  Kullanım Şartları
                </Link>{" "}
                ve{" "}
                <Link href="#" className="text-primary hover:underline">
                  Gizlilik Politikası
                </Link>
                'nı kabul etmiş olursunuz.
              </p>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              Zaten hesabın var mı?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Giriş yap
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
