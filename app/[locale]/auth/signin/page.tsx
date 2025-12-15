"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Mail, Lock, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

function SignInForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleOAuthSignIn = (provider: "google" | "facebook") => {
    signIn(provider, { callbackUrl });
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
        {/* OAuth Providers */}
        <div className="space-y-3 mb-6">
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-2 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
            onClick={() => handleOAuthSignIn("google")}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t("continueWithGoogle")}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-2 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
            onClick={() => handleOAuthSignIn("facebook")}
          >
            <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            {t("continueWithFacebook")}
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">{t("or")}</span>
          </div>
        </div>

        {/* Credentials Form */}
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
            <Link
              href="/auth/forgot-password"
              className="text-[#C9A227] hover:text-[#A88B1F] font-medium"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#C9A227] hover:bg-[#A88B1F] text-white font-semibold text-base transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("signingIn") : t("signIn")}
          </Button>
        </form>

        {/* Demo Credentials Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 font-medium mb-1">
            {t("forTesting")}
          </p>
          <p className="text-xs text-blue-700">
            Email: demo@example.com
            <br />
            Password: demo123
          </p>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {t("noAccount")}{" "}
          <Link
            href="/auth/signup"
            className="text-[#C9A227] hover:text-[#A88B1F] font-semibold"
          >
            {t("signUp")}
          </Link>
        </div>
      </Card>
    </>
  );
}

function SignInFormSkeleton() {
  return (
    <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
      <div className="space-y-3 mb-6">
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
      </div>
    </Card>
  );
}

export default function SignInPage() {
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
            {t("welcomeBack")}
          </h1>
          <p className="text-gray-600">
            {t("signInSubtitle")}
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
