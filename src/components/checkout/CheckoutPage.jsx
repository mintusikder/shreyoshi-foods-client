
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  User,
  MapPin,
  CreditCard,
  Banknote,
  Wallet,
  ShoppingBag,
  Package,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/api/orders";

const FREE_DELIVERY_LIMIT = 3000;
const DELIVERY_CHARGE = 80;

const districts = [
  "Dhaka",
  "Chattogram",
  "Barishal",
  "Bhola",
  "Khulna",
  "Rajshahi",
  "Rangpur",
  "Sylhet",
  "Mymensingh",
  "Cumilla",
  "Faridpur",
  "Patuakhali",
];

const formatPrice = (price) =>
  `৳${Number(price || 0).toLocaleString("en-BD")}`;

export default function CheckoutPage() {
  const {
    cartItems = [],
    checkoutItems = [],
    checkoutMode,
    clearCart,
    clearCheckout,
  } = useCart();

  const items = checkoutItems.length > 0 ? checkoutItems : cartItems;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    district: "",
    area: "",
    address: "",
    note: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
    [items]
  );

  const deliveryCharge =
    subtotal >= FREE_DELIVERY_LIMIT || subtotal === 0
      ? 0
      : DELIVERY_CHARGE;

  const total = subtotal + deliveryCharge;

  const updateField = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "আপনার নাম লিখুন";
    }

    if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন";
    }

    if (!form.district) {
      newErrors.district = "জেলা নির্বাচন করুন";
    }

    if (!form.area.trim()) {
      newErrors.area = "এলাকা লিখুন";
    }

    if (!form.address.trim()) {
      newErrors.address = "সম্পূর্ণ ঠিকানা লিখুন";
    }

    if (!agree) {
      newErrors.agree = "শর্তাবলীতে সম্মতি দিন";
    }

    if (items.length === 0) {
      newErrors.items = "আপনার Cart-এ কোনো Product নেই";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCoupon = () => {
    if (!coupon.trim()) {
      setCouponMessage("Coupon code লিখুন");
      return;
    }

    setCouponMessage("Coupon validation এখনো সংযুক্ত করা হয়নি।");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitMessage("");
    setOrderSuccess(null);

    try {
      const orderData = {
        customer: {
          name: form.name,
          phone: form.phone,
          email: form.email,
        },
        shippingAddress: {
          district: form.district,
          area: form.area,
          address: form.address,
        },
        items: items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
        })),
        paymentMethod,
        note: form.note,
      };

      const result = await createOrder(orderData);

      setOrderSuccess({
        orderId: result.order.orderId,
        total: result.order.total,
      });

      if (checkoutMode !== "buyNow") {
        clearCart();
      }

      clearCheckout();
    } catch (error) {
      setSubmitMessage(
        error.message || "অর্ডার করা যায়নি। আবার চেষ্টা করুন।"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Order success screen
  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-[#F7F6E9] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#e8e6d6] p-7 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} className="text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-[#33331f]">
            Order Successful!
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।
          </p>

          <div className="bg-[#F7F6E9] rounded-xl p-4 mt-5 text-left space-y-2">
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-semibold text-[#55532B]">
                {orderSuccess.orderId}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Amount</span>
              <span className="font-bold text-[#55532B]">
                {formatPrice(orderSuccess.total)}
              </span>
            </div>
          </div>

          <Link
            href="/products"
            className="mt-5 w-full h-11 rounded-lg bg-[#55532B] text-white flex items-center justify-center gap-2 text-sm font-semibold hover:bg-[#414021] transition"
          >
            Continue Shopping
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#F7F6E9] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#e8e6d6] p-8 max-w-md w-full text-center">
          <ShoppingBag
            size={35}
            className="text-[#55532B] mx-auto mb-4"
          />

          <h2 className="text-xl font-bold text-[#33331f]">
            Your Cart is Empty
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Checkout করার আগে Cart-এ Product যোগ করুন।
          </p>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 mt-5 bg-[#55532B] text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  const inputClass =
    "w-full h-9 px-3 text-sm rounded-lg border border-gray-200 bg-white outline-none focus:border-[#55532B] transition";

  const labelClass =
    "block text-xs font-medium text-gray-600 mb-1";

  return (
    <main className="min-h-[calc(100vh-130px)] bg-[#F7F6E9] py-4">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#33331f]">
              Checkout
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              আপনার অর্ডারের তথ্য পূরণ করুন
            </p>
          </div>

          <Link
            href="/products"
            className="flex items-center gap-1.5 text-xs font-medium text-[#55532B] hover:underline"
          >
            <ArrowLeft size={15} />
            Continue Shopping
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">

            {/* LEFT: Customer Information */}
            <section className="lg:col-span-7 bg-white border border-[#e8e6d6] rounded-xl p-3.5 md:p-4">

              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                <User size={17} className="text-[#55532B]" />
                <h2 className="text-sm font-semibold text-[#33331f]">
                  Customer Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2.5">

                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    placeholder="আপনার সম্পূর্ণ নাম"
                    className={inputClass}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={updateField}
                    inputMode="numeric"
                    placeholder="01XXXXXXXXX"
                    className={inputClass}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="example@email.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>District *</label>
                  <select
                    name="district"
                    value={form.district}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.district}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Area / Upazila *</label>
                  <input
                    name="area"
                    value={form.area}
                    onChange={updateField}
                    placeholder="Area / Upazila"
                    className={inputClass}
                  />
                  {errors.area && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.area}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Full Address *</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={updateField}
                    placeholder="House, Road, Village..."
                    className={inputClass}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>
                    Order Note (Optional)
                  </label>
                  <input
                    name="note"
                    value={form.note}
                    onChange={updateField}
                    placeholder="কোনো বিশেষ নির্দেশনা থাকলে লিখুন"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="border-t border-gray-100 mt-4 pt-3">
                <div className="flex items-center gap-2 mb-2.5">
                  <CreditCard size={17} className="text-[#55532B]" />
                  <h2 className="text-sm font-semibold text-[#33331f]">
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    {
                      value: "cod",
                      label: "Cash on Delivery",
                      description: "পণ্য পেয়ে পেমেন্ট",
                      Icon: Banknote,
                    },
                    {
                      value: "bkash",
                      label: "bKash",
                      description: "Pay with bKash",
                      Icon: Wallet,
                    },
                    {
                      value: "online",
                      label: "Online Payment",
                      description: "Card / Mobile Banking",
                      Icon: CreditCard,
                    },
                  ].map(({ value, label, description, Icon }) => (
                    <label
                      key={value}
                      className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition ${
                        paymentMethod === value
                          ? "border-[#55532B] bg-[#f7f6ef]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={value}
                        checked={paymentMethod === value}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value)
                        }
                        className="accent-[#55532B]"
                      />

                      <Icon
                        size={17}
                        className="shrink-0 text-[#55532B]"
                      />

                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold text-gray-800">
                          {label}
                        </span>
                        <span className="block text-[10px] text-gray-500">
                          {description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* RIGHT: Order Summary */}
            <aside className="lg:col-span-5 bg-white border border-[#e8e6d6] rounded-xl p-3.5 md:p-4">

              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={17} className="text-[#55532B]" />
                  <h2 className="text-sm font-semibold text-[#33331f]">
                    Order Summary
                  </h2>
                </div>

                <span className="text-xs text-gray-500">
                  {items.length} Items
                </span>
              </div>

              {/* Products */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {items.map((item, index) => (
                  <div
                    key={item.productId || item._id || index}
                    className="flex items-center gap-2.5"
                  >
                    <div className="relative w-11 h-11 rounded-lg bg-[#f7f6ef] overflow-hidden shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name || "Product"}
                          fill
                          sizes="44px"
                          unoptimized
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={18} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="text-xs font-semibold text-[#55532B] whitespace-nowrap">
                      {formatPrice(
                        Number(item.price || 0) *
                        Number(item.quantity || 1)
                      )}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="border-t border-gray-100 mt-3 pt-3">
                <label className={labelClass}>Coupon Code</label>

                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter coupon"
                    className="flex-1 min-w-0 h-9 px-3 text-xs rounded-lg border border-gray-200 outline-none focus:border-[#55532B]"
                  />

                  <button
                    type="button"
                    onClick={handleCoupon}
                    className="h-9 px-3 text-xs font-medium rounded-lg border border-[#55532B] text-[#55532B] hover:bg-[#55532B] hover:text-white transition"
                  >
                    Apply
                  </button>
                </div>

                {couponMessage && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Price details */}
              <div className="border-t border-gray-100 mt-3 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span>
                    {deliveryCharge === 0
                      ? "Free"
                      : formatPrice(deliveryCharge)}
                  </span>
                </div>

                {subtotal > 0 && subtotal < FREE_DELIVERY_LIMIT && (
                  <p className="text-[11px] text-[#77744a]">
                    আরও {formatPrice(FREE_DELIVERY_LIMIT - subtotal)} কিনলে
                    Free Delivery পাবেন।
                  </p>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-800">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-[#55532B]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Terms */}
              <div className="border-t border-gray-100 mt-3 pt-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 accent-[#55532B]"
                  />

                  <span className="text-[11px] text-gray-500 leading-5">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-[#55532B] underline"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-[#55532B] underline"
                    >
                      Privacy Policy
                    </Link>.
                  </span>
                </label>

                {errors.agree && (
                  <p className="text-red-500 text-[11px] mt-1">
                    {errors.agree}
                  </p>
                )}

                {errors.items && (
                  <p className="text-red-500 text-[11px] mt-1">
                    {errors.items}
                  </p>
                )}
              </div>

              {/* API Error */}
              {submitMessage && (
                <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-2.5">
                  <p className="text-xs text-red-600">
                    {submitMessage}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-3 h-10 rounded-lg bg-[#55532B] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#414021] transition disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Order
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-gray-400 mt-2">
                Secure Checkout · Reliable Delivery
              </p>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}
