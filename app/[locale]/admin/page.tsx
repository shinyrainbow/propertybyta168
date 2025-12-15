"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Mail, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

function SignInForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin-dashboard";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/admin-dashboard");
    }
  }, [status, session, router]);

  // Show loading while checking session
  if (status === "loading" || (status === "authenticated" && session)) {
    return (
      <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 text-sm">กำลังตรวจสอบ...</p>
        </div>
      </Card>
    );
  }

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Error Alert */}
      {(error || errorMessage) && (
        <Card className="mb-6 p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">
              {errorMessage || t("loginError")}
            </p>
          </div>
        </Card>
      )}

      {/* Sign In Card */}
      <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("email")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 border-gray-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("password")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="password"
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 border-gray-300"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#C9A227] border-gray-300 rounded focus:ring-[#C9A227]"
              />
              <span className="text-gray-700">{t("rememberMe")}</span>
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#C9A227] hover:bg-[#A88B1F] text-white font-semibold text-base transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("signingIn") : t("signIn")}
          </Button>
        </form>

        {/* Admin Credentials Info */}
        {/* <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 font-medium mb-1">
            Admin:
          </p>
          <p className="text-xs text-blue-700">
            Email: admin@budgetwiseproperty.com
            <br />
            Password: admin123
          </p>
        </div> */}
      </Card>
    </>
  );
}

function SignInFormSkeleton() {
  return (
    <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
      </div>
    </Card>
  );
}

export default function AdminSignInPage() {
  const t = useTranslations("auth");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NCAwLTE4IDguMDYtMTggMThzOC4wNiAxOCAxOCAxOCAxOC04LjA2IDE4LTE4LTguMDYtMTgtMTgtMTh6bS00LjUgMjcuNUMxOC42IDQzLjIgOCAzMi43IDggMjBjMC03LjcgNi4zLTE0IDE0LTE0czE0IDYuMyAxNCAxNC02LjMgMTQtMTQgMTR6IiBmaWxsPSIjYzZhZjZjIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-50" />

      <div className="relative w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <Building2 className="w-12 h-12 text-[#C9A227]" />
            <span className="text-3xl font-bold text-gray-900">
              Sky Pro Property
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600">
            {t("manageProperties")}
          </p>
        </div>

        <Suspense fallback={<SignInFormSkeleton />}>
          <SignInForm />
        </Suspense>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-[#C9A227] transition-colors duration-300"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
