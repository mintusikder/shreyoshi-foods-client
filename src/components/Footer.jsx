import Link from "next/link";

import {
  Sprout,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Leaf,
  Truck,
  Headset,
} from "lucide-react";

// Social Media Icons
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa6";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Story", href: "/story" },
  { name: "Our Process", href: "/process" },
  { name: "Contact Us", href: "/contact" },
];

const shopLinks = [
  { name: "Mustard Oil", href: "/shop?category=mustard-oil" },
  { name: "Organic Honey", href: "/shop?category=honey" },
  { name: "Pure Ghee", href: "/shop?category=ghee" },
  { name: "Rice & Pulses", href: "/shop?category=rice-pulses" },
  { name: "Natural Spices", href: "/shop?category=spices" },
  { name: "All Products", href: "/shop" },
];

const supportLinks = [
  { name: "My Account", href: "/login" },
  { name: "My Orders", href: "/orders" },
  { name: "Track Order", href: "/track-order" },
  { name: "Shopping Cart", href: "/cart" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="bg-[#55532B] text-[#FFFEF7]">
      {/* ================= BENEFITS SECTION ================= */}
      <div className="border-b border-[#E8DCA9]/20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-9 sm:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8DCA9] text-[#55532B]">
              <Leaf size={24} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Natural & Pure</h3>
              <p className="mt-1 text-xs text-[#F7F6E9]/70">
                Quality food for a healthier lifestyle.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8DCA9] text-[#55532B]">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Reliable Delivery</h3>
              <p className="mt-1 text-xs text-[#F7F6E9]/70">
                Convenient delivery to your doorstep.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8DCA9] text-[#55532B]">
              <Headset size={24} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Customer Support</h3>
              <p className="mt-1 text-xs text-[#F7F6E9]/70">
                We're here to help you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN FOOTER ================= */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
        {/* BRAND INFORMATION */}
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFFEF7] text-[#55532B]">
              <Sprout size={30} strokeWidth={1.5} />
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold">Shreyoshi Foods</h2>
              <p className="mt-1 text-[9px] font-semibold tracking-[3px] text-[#E8DCA9]">
                PURE NATURE · PURE TASTE
              </p>
            </div>
          </Link>

          <p className="mt-6 max-w-sm text-sm leading-7 text-[#F7F6E9]/75">
            Bringing the goodness of nature to your home. Discover quality food
            products, natural ingredients and authentic taste with Shreyoshi
            Foods.
          </p>

          {/* SOCIAL ICONS */}

          <div className="mt-7">
            <h3 className="mb-4 text-sm font-semibold">Follow Us</h3>

            <div className="flex items-center gap-3">
              {/* Facebook */}
              <Link
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DCA9]/40 text-[#E8DCA9] transition hover:bg-[#E8DCA9] hover:text-[#55532B]"
              >
                <FaFacebookF size={17} />
              </Link>

              {/* Instagram */}
              <Link
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DCA9]/40 text-[#E8DCA9] transition hover:bg-[#E8DCA9] hover:text-[#55532B]"
              >
                <FaInstagram size={18} />
              </Link>

              {/* YouTube */}
              <Link
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8DCA9]/40 text-[#E8DCA9] transition hover:bg-[#E8DCA9] hover:text-[#55532B]"
              >
                <FaYoutube size={19} />
              </Link>
            </div>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="mb-6 text-base font-semibold text-[#E8DCA9]">
            Quick Links
          </h3>

          <ul className="space-y-4">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-[#F7F6E9]/75 transition hover:text-[#E8DCA9]"
                >
                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                  />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* SHOP CATEGORIES */}
        <div>
          <h3 className="mb-6 text-base font-semibold text-[#E8DCA9]">
            Shop Categories
          </h3>

          <ul className="space-y-4">
            {shopLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm text-[#F7F6E9]/75 transition hover:text-[#E8DCA9]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CUSTOMER SUPPORT */}
        <div>
          <h3 className="mb-6 text-base font-semibold text-[#E8DCA9]">
            Customer Support
          </h3>

          <ul className="space-y-4">
            {supportLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm text-[#F7F6E9]/75 transition hover:text-[#E8DCA9]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ================= CONTACT SECTION ================= */}
      <div className="border-t border-[#E8DCA9]/20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-3">
          <Link href="/contact" className="flex items-center gap-3">
            <Mail className="shrink-0 text-[#E8DCA9]" size={21} />
            <div>
              <p className="text-xs text-[#F7F6E9]/60">Email Us</p>
              <p className="mt-1 text-sm font-medium">Contact Us</p>
            </div>
          </Link>

          <Link href="/contact" className="flex items-center gap-3">
            <Phone className="shrink-0 text-[#E8DCA9]" size={21} />
            <div>
              <p className="text-xs text-[#F7F6E9]/60">Need Help?</p>
              <p className="mt-1 text-sm font-medium">Get In Touch</p>
            </div>
          </Link>

          <Link href="/contact" className="flex items-center gap-3">
            <MapPin className="shrink-0 text-[#E8DCA9]" size={21} />
            <div>
              <p className="text-xs text-[#F7F6E9]/60">Our Location</p>
              <p className="mt-1 text-sm font-medium">Visit Our Store</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ================= BOTTOM FOOTER ================= */}
      <div className="border-t border-[#E8DCA9]/20 bg-[#494722]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-[#F7F6E9]/65">
            © {new Date().getFullYear()} Shreyoshi Foods. All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#F7F6E9]/65">
            <Link
              href="/privacy-policy"
              className="transition hover:text-[#E8DCA9]"
            >
              Privacy Policy
            </Link>

            <span className="text-[#E8DCA9]/40">|</span>

            <Link href="/terms" className="transition hover:text-[#E8DCA9]">
              Terms & Conditions
            </Link>

            <span className="text-[#E8DCA9]/40">|</span>

            <span className="text-[#E8DCA9]">Made with ♥</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
