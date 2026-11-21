
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Leaf,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  CheckCircle2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { error: loginError } = await authClient.signIn.email({
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe,
        callbackURL: "/",
      });

      if (loginError) {
        setError(
          loginError.message || "Invalid email or password."
        );
        return;
      }

      setSuccess("Login successful! Welcome to Shreyoshi Foods.");

      router.push("/");
      router.refresh();

    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F6E9] px-4 py-10 sm:px-6">

      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-[#FFFEF7] shadow-2xl lg:grid-cols-2">

        {/* Left Side */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#55532B] p-10 text-white lg:flex">

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#E8DCA9]/20 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#E8DCA9]/10 blur-3xl" />

          {/* Brand */}
          <Link href="/" className="relative z-10 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8DCA9] text-[#55532B]">
              <Leaf size={26} />
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold">
                Shreyoshi Foods
              </h2>

              <p className="text-[10px] tracking-[3px] text-[#E8DCA9]">
                PURE NATURE · PURE TASTE
              </p>
            </div>

          </Link>

          {/* Welcome Content */}
          <div className="relative z-10 py-10">

            <span className="text-sm font-semibold uppercase tracking-[3px] text-[#E8DCA9]">
              Welcome Back
            </span>

            <h1 className="mt-5 font-serif text-5xl font-bold leading-tight">
              Nature's Best.
              <br />
              Your Favorite
              <br />
              <span className="italic text-[#E8DCA9]">
                Taste.
              </span>
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/75">
              Sign in to your account and continue enjoying
              the authentic goodness of natural food products.
            </p>

          </div>

          <div className="relative z-10 flex items-center gap-2 text-sm text-white/60">
            <Leaf size={16} className="text-[#E8DCA9]" />
            Pure Taste, Every Day
          </div>

        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">

          {/* Back to Home */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#77745C] transition hover:text-[#55532B]"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          {/* Heading */}
          <div className="mb-8">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8DCA9]/40 text-[#55532B] lg:hidden">
              <Leaf size={25} />
            </div>

            <h2 className="font-serif text-3xl font-bold text-[#55532B]">
              Welcome Back!
            </h2>

            <p className="mt-2 text-sm text-[#77745C]">
              Sign in to access your Shreyoshi Foods account.
            </p>

          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#55532B]">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A946F]"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-[#55532B]/15 bg-white py-3.5 pl-11 pr-4 text-sm text-[#55532B] outline-none transition placeholder:text-[#AAA58F] focus:border-[#55532B] focus:ring-2 focus:ring-[#55532B]/10"
                />

              </div>
            </div>

            {/* Password */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-[#55532B]">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A946F]"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-[#55532B]/15 bg-white py-3.5 pl-11 pr-12 text-sm text-[#55532B] outline-none transition placeholder:text-[#AAA58F] focus:border-[#55532B] focus:ring-2 focus:ring-[#55532B]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A946F] transition hover:text-[#55532B]"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex flex-wrap items-center justify-between gap-3">

              <label className="flex cursor-pointer items-center gap-2 text-xs text-[#77745C]">

                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#55532B]"
                />

                Remember me

              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[#77743B] transition hover:text-[#55532B]"
              >
                Forgot Password?
              </Link>

            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              >
                <CheckCircle2 size={17} />
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#55532B] py-4 text-sm font-bold text-[#FFFEF7] transition duration-300 hover:bg-[#77743B] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? "Signing In..." : "Sign In"}

              {!loading && (
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}

            </button>

          </form>

          {/* Signup Link */}
          <p className="mt-7 text-center text-sm text-[#77745C]">

            Don't have an account?{" "}

            <Link
              href="/auth/signup"
              className="font-bold text-[#55532B] underline-offset-4 hover:underline"
            >
              Create Account
            </Link>

          </p>

          {/* Footer */}
          <p className="mt-8 text-center text-[11px] text-[#9A946F]">
            © {new Date().getFullYear()} Shreyoshi Foods. All rights reserved.
          </p>

        </div>
      </div>
    </main>
  );
};

export default LoginPage;
