
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
  User,
  Mail,
  Lock,
  CheckCircle2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const SignupPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password validation
  const passwordChecks = [
    {
      label: "At least 8 characters",
      valid: formData.password.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(formData.password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(formData.password),
    },
    {
      label: "One number",
      valid: /[0-9]/.test(formData.password),
    },
  ];

  const isPasswordValid = passwordChecks.every(
    (item) => item.valid
  );

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!isPasswordValid) {
      setError(
        "Please create a password that meets all requirements."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { error: signupError } =
        await authClient.signUp.email({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          callbackURL: "/",
        });

      if (signupError) {
        setError(
          signupError.message ||
            "Unable to create your account."
        );
        return;
      }

      setSuccess(
        "Your account has been created successfully!"
      );

      // Notify Navbar about authentication changes
      window.dispatchEvent(
        new Event("auth-state-changed")
      );

      // Allow the session to update
      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      router.replace("/");
      router.refresh();

    } catch (err) {
      setError(
        err.message ||
          "Something went wrong. Please try again."
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

          <Link
            href="/"
            className="relative z-10 flex items-center gap-3"
          >
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

          <div className="relative z-10 py-10">
            <span className="text-sm font-semibold uppercase tracking-[3px] text-[#E8DCA9]">
              Welcome to Nature
            </span>

            <h1 className="mt-5 font-serif text-5xl font-bold leading-tight">
              Good Food.
              <br />
              Good Life.
              <br />
              <span className="italic text-[#E8DCA9]">
                Naturally.
              </span>
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/75">
              Discover the goodness of carefully selected
              food products and bring natural taste to your home.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-sm text-white/60">
            <Leaf size={16} className="text-[#E8DCA9]" />
            Pure Taste, Every Day
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="p-6 sm:p-10 lg:p-12">

          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#77745C] transition hover:text-[#55532B]"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>

          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8DCA9]/40 text-[#55532B] lg:hidden">
              <Leaf size={25} />
            </div>

            <h2 className="font-serif text-3xl font-bold text-[#55532B]">
              Create Account
            </h2>

            <p className="mt-2 text-sm text-[#77745C]">
              Join Shreyoshi Foods and enjoy the goodness of nature.
            </p>
          </div>

          <form
            onSubmit={handleSignup}
            className="space-y-5"
          >

            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#55532B]">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A946F]"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-[#55532B]/15 bg-white py-3.5 pl-11 pr-4 text-sm text-[#55532B] outline-none transition placeholder:text-[#AAA58F] focus:border-[#55532B] focus:ring-2 focus:ring-[#55532B]/10 disabled:opacity-60"
                />
              </div>
            </div>

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
                  disabled={loading}
                  className="w-full rounded-xl border border-[#55532B]/15 bg-white py-3.5 pl-11 pr-4 text-sm text-[#55532B] outline-none transition placeholder:text-[#AAA58F] focus:border-[#55532B] focus:ring-2 focus:ring-[#55532B]/10 disabled:opacity-60"
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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-[#55532B]/15 bg-white py-3.5 pl-11 pr-12 text-sm text-[#55532B] outline-none transition placeholder:text-[#AAA58F] focus:border-[#55532B] focus:ring-2 focus:ring-[#55532B]/10 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A946F] hover:text-[#55532B]"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {/* Password Validation */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {passwordChecks.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-1.5 text-[11px] ${
                      item.valid
                        ? "text-[#55532B]"
                        : "text-[#9A946F]"
                    }`}
                  >
                    <CheckCircle2
                      size={13}
                      className={
                        item.valid
                          ? "text-green-600"
                          : "text-[#C5BEA6]"
                      }
                    />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#55532B]">
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A946F]"
                />

                <input
                  type={
                    showConfirmPassword ? "text" : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-[#55532B]/15 bg-white py-3.5 pl-11 pr-12 text-sm text-[#55532B] outline-none transition placeholder:text-[#AAA58F] focus:border-[#55532B] focus:ring-2 focus:ring-[#55532B]/10 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A946F] hover:text-[#55532B]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {formData.confirmPassword &&
                formData.password !==
                  formData.confirmPassword && (
                  <p className="mt-2 text-xs text-red-600">
                    Passwords do not match.
                  </p>
                )}
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
                className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              >
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#55532B] py-4 text-sm font-bold text-[#FFFEF7] transition duration-300 hover:bg-[#77743B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}

              {!loading && (
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-7 text-center text-sm text-[#77745C]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-bold text-[#55532B] underline-offset-4 hover:underline"
            >
              Sign In
            </Link>
          </p>

          <p className="mt-8 text-center text-[11px] leading-5 text-[#9A946F]">
            By creating an account, you agree to use Shreyoshi
            Foods responsibly and keep your account credentials
            secure.
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;
