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
  loginWithEmail,
  loginWithGoogle,
  loginWithMicrosoft,
  loginWithX,
} from "@/lib/auth";
import { Mail, Lock, ArrowRight } from "lucide-react";

type Provider = "google" | "microsoft" | "x";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [oauthDialog, setOauthDialog] = useState<{
    open: boolean;
    provider: Provider | null;
  }>({ open: false, provider: null });

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Lütfen tüm alanları doldurun");
      }
      loginWithEmail(email, password);
      // Hard navigation ile ana sayfaya git
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
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
    // setTimeout ile bir sonraki tick'e bırakıyoruz ki localStorage yazılsın
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
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
        className="fixed top-20 left-[10%] w-72 h-72 rounded-full bg-primary/5 blur-3xl -z-10"
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
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
                Tekrar Hoş Geldin
              </h1>
              <p className="text-muted-foreground text-sm">
                Hesabına giriş yap ve yazmaya devam et
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

            {/* Email Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Şifre</Label>
                  <Link
                    href="#"
                    className="text-xs text-primary hover:underline"
                  >
                    Şifremi unuttum
                  </Link>
                </div>
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
                  {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground mt-8">
              Hesabın yok mu?{" "}
              <Link
                href="/register"
                className="text-primary font-medium hover:underline"
              >
                Kayıt ol
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
