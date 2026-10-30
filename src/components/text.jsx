
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Star,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    name: "Mustard Oil",
    subtitle: "Pure & Natural",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=85",
    href: "/shop?category=mustard-oil",
  },
  {
    name: "Organic Honey",
    subtitle: "Sweetness of Nature",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=85",
    href: "/shop?category=honey",
  },
  {
    name: "Pure Ghee",
    subtitle: "Rich & Authentic",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=85",
    href: "/shop?category=ghee",
  },
  {
    name: "Natural Spices",
    subtitle: "Flavourful Goodness",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=85",
    href: "/shop?category=spices",
  },
];

const products = [
  {
    id: 1,
    name: "Premium Mustard Oil",
    category: "Pure & Natural",
    price: "৳350",
    oldPrice: "৳400",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=85",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Natural Organic Honey",
    category: "100% Natural",
    price: "৳450",
    oldPrice: "৳500",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=85",
    tag: "Popular",
  },
  {
    id: 3,
    name: "Authentic Pure Ghee",
    category: "Traditional Taste",
    price: "৳650",
    oldPrice: "৳750",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=85",
    tag: "Featured",
  },
  {
    id: 4,
    name: "Premium Natural Spices",
    category: "Fresh Ingredients",
    price: "৳250",
    oldPrice: "৳300",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=85",
    tag: "New Arrival",
  },
];

const benefits = [
  {
    icon: Leaf,
    title: "Natural Ingredients",
    description:
      "We focus on carefully selected ingredients and natural food products.",
  },
  {
    icon: ShieldCheck,
    title: "Quality First",
    description:
      "Quality and customer satisfaction are at the heart of our brand.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description:
      "Get your favourite food products delivered to your doorstep.",
  },
  {
    icon: HeartHandshake,
    title: "Customer Care",
    description:
      "We value every customer and work to make your shopping experience better.",
  },
];

export default function HomeHero() {
  return (
    <main className="overflow-hidden bg-[#FFFEF7]">

      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-[#F7F6E9]">

        <div className="mx-auto grid min-h-[570px] max-w-full items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-20">

          {/* Hero Content */}
          <div className="relative z-10">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#55532B]/20 bg-white/70 px-4 py-2">
              <Leaf size={16} className="text-[#77743B]" />
              <span className="text-xs font-semibold uppercase tracking-[2px] text-[#55532B]">
                Welcome to Shreyoshi Foods
              </span>
            </div>

            <h1 className="max-w-xl font-serif text-5xl font-bold leading-[1.12] text-[#55532B] sm:text-6xl lg:text-[68px]">
              Taste the
              <span className="block italic text-[#9A8540]">
                Goodness
              </span>
              of Nature.
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-[#77745C] sm:text-lg">
              Discover the authentic taste of nature with
              carefully selected food products. Bringing
              quality, freshness and goodness to every home.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">

              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 rounded-full bg-[#55532B] px-8 py-4 text-sm font-semibold text-[#FFFEF7] transition duration-300 hover:bg-[#77743B]"
              >
                Explore Products
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border border-[#55532B]/30 px-8 py-4 text-sm font-semibold text-[#55532B] transition hover:bg-[#55532B] hover:text-white"
              >
                Our Story
                <ArrowUpRight size={17} />
              </Link>

            </div>

            {/* Hero Trust */}
            <div className="mt-12 flex flex-wrap gap-7 border-t border-[#55532B]/15 pt-7">

              <div>
                <p className="font-serif text-2xl font-bold text-[#55532B]">
                  Natural
                </p>
                <p className="mt-1 text-xs text-[#77745C]">
                  Food Choices
                </p>
              </div>

              <div className="h-12 w-px bg-[#55532B]/20" />

              <div>
                <p className="font-serif text-2xl font-bold text-[#55532B]">
                  Quality
                </p>
                <p className="mt-1 text-xs text-[#77745C]">
                  Focused Products
                </p>
              </div>

              <div className="h-12 w-px bg-[#55532B]/20" />

              <div>
                <p className="font-serif text-2xl font-bold text-[#55532B]">
                  Care
                </p>
                <p className="mt-1 text-xs text-[#77745C]">
                  For Every Home
                </p>
              </div>

            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto w-full max-w-[560px]">

            <div className="absolute -right-5 -top-5 h-40 w-40 rounded-full bg-[#E8DCA9]/60 blur-2xl" />

            <div className="relative overflow-hidden rounded-[180px_180px_24px_24px] border-[8px] border-white shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1000&q=90"
                alt="Fresh natural food ingredients"
                className="h-[430px] w-full object-cover sm:h-[520px]"
              />
            </div>

            <div className="absolute -bottom-6 -left-5 flex items-center gap-3 rounded-2xl bg-[#55532B] p-4 text-white shadow-xl sm:-left-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8DCA9] text-[#55532B]">
                <SproutIcon />
              </div>
              <div>
                <p className="font-semibold">Nature Inspired</p>
                <p className="mt-1 text-xs text-white/70">
                  Pure Taste, Every Day
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CATEGORY SECTION ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-[#9A8540]">
              Explore Our Collection
            </p>

            <h2 className="font-serif text-3xl font-bold text-[#55532B] sm:text-4xl">
              Shop By Category
            </h2>

            <p className="mt-3 text-sm text-[#77745C]">
              Discover something naturally delicious for your home.
            </p>
          </div>

          <Link
            href="/shop"
            className="group flex items-center gap-2 text-sm font-semibold text-[#55532B] hover:text-[#9A8540]"
          >
            View All Categories
            <ArrowRight
              size={17}
              className="transition group-hover:translate-x-1"
            />
          </Link>

        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">

          {categories.map((category) => (
            <Link
              href={category.href}
              key={category.name}
              className="group overflow-hidden rounded-2xl border border-[#E8DCA9]/50 bg-[#F7F6E9] transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-48 w-full object-cover transition duration-700 group-hover:scale-110 sm:h-64"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#252413]/50 to-transparent" />

                <div className="absolute bottom-4 left-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFEF7] text-[#55532B]">
                  <ArrowUpRight size={19} />
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="font-serif text-lg font-bold text-[#55532B]">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs text-[#77745C]">
                  {category.subtitle}
                </p>
              </div>

            </Link>
          ))}

        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="bg-[#F7F6E9] py-20">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-[#9A8540]">
                Customer Favourites
              </p>

              <h2 className="font-serif text-3xl font-bold text-[#55532B] sm:text-4xl">
                Our Best Sellers
              </h2>

              <p className="mt-3 text-sm text-[#77745C]">
                Explore some of our popular food products.
              </p>
            </div>

            <Link
              href="/shop"
              className="flex items-center gap-2 rounded-full border border-[#55532B]/30 px-6 py-3 text-sm font-semibold text-[#55532B] transition hover:bg-[#55532B] hover:text-white"
            >
              Shop All Products
              <ArrowRight size={17} />
            </Link>

          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">

            {products.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-[#E8DCA9]/60 bg-[#FFFEF7] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="relative overflow-hidden">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-64"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-[#55532B] px-3 py-1.5 text-[10px] font-semibold text-white">
                    {product.tag}
                  </span>

                </div>

                <div className="p-4 sm:p-5">

                  <p className="text-[11px] text-[#9A8540]">
                    {product.category}
                  </p>

                  <h3 className="mt-2 min-h-10 font-serif text-base font-bold text-[#55532B] sm:text-lg">
                    {product.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-lg font-bold text-[#55532B]">
                      {product.price}
                    </span>
                    <span className="text-xs text-[#999] line-through">
                      {product.oldPrice}
                    </span>
                  </div>

                  <Link
                    href={`/shop`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-[#55532B] py-3 text-xs font-semibold text-[#55532B] transition hover:bg-[#55532B] hover:text-white"
                  >
                    View Product
                    <ArrowUpRight size={15} />
                  </Link>

                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

        <div className="mx-auto mb-14 max-w-2xl text-center">

          <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-[#9A8540]">
            The Shreyoshi Promise
          </p>

          <h2 className="font-serif text-3xl font-bold text-[#55532B] sm:text-4xl">
            Why Choose Shreyoshi Foods?
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#77745C]">
            We believe good food makes every moment better.
            That's why we focus on quality, care and a better
            food shopping experience.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-[#E8DCA9]/60 bg-[#F7F6E9] p-7 text-center transition hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#55532B] text-[#E8DCA9]">
                  <Icon size={28} strokeWidth={1.5} />
                </div>

                <h3 className="mt-6 font-serif text-xl font-bold text-[#55532B]">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#77745C]">
                  {benefit.description}
                </p>
              </div>
            );
          })}

        </div>
      </section>

      {/* ================= BRAND STORY ================= */}
      <section className="bg-[#F7F6E9] py-20">

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1000&q=85"
              alt="Healthy food ingredients and fresh vegetables"
              className="h-[400px] w-full rounded-[24px] object-cover shadow-lg sm:h-[480px]"
            />

            <div className="absolute -bottom-5 -right-3 rounded-2xl bg-[#E8DCA9] px-6 py-5 text-center shadow-lg sm:-right-5">
              <SproutIcon />
              <p className="mt-2 font-serif text-lg font-bold text-[#55532B]">
                Inspired by Nature
              </p>
            </div>
          </div>

          <div className="lg:pl-8">

            <p className="mb-4 text-xs font-bold uppercase tracking-[3px] text-[#9A8540]">
              A Little About Us
            </p>

            <h2 className="font-serif text-3xl font-bold leading-tight text-[#55532B] sm:text-5xl">
              Bringing Natural
              <span className="block italic text-[#9A8540]">
                Goodness Home.
              </span>
            </h2>

            <p className="mt-7 text-sm leading-8 text-[#77745C]">
              At Shreyoshi Foods, we believe that every home
              deserves quality food and authentic taste.

              Our journey is driven by a passion for good food,
              carefully selected ingredients and the happiness
              of our customers.
            </p>

            <div className="mt-7 space-y-4">

              {[
                "Carefully selected food products",
                "Focus on quality and freshness",
                "A commitment to customer satisfaction",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-[#8C8245]"
                  />
                  <span className="text-sm font-medium text-[#55532B]">
                    {item}
                  </span>
                </div>
              ))}

            </div>

            <Link
              href="/about"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#55532B] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#77743B]"
            >
              Discover Our Story
              <ArrowRight size={18} />
            </Link>

          </div>
        </div>
      </section>

      {/* ================= PROMOTIONAL BANNER ================= */}
      <section className="px-6 py-20">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[#55532B] px-7 py-16 text-center sm:px-16 sm:py-20">

          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border border-[#E8DCA9]/20" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full border border-[#E8DCA9]/20" />

          <div className="relative z-10">

            <Sparkles
              size={32}
              className="mx-auto text-[#E8DCA9]"
            />

            <p className="mt-5 text-xs font-bold uppercase tracking-[3px] text-[#E8DCA9]">
              Discover Something Natural
            </p>

            <h2 className="mx-auto mt-5 max-w-2xl font-serif text-3xl font-bold leading-tight text-[#FFFEF7] sm:text-5xl">
              Make Every Meal
              <span className="block italic text-[#E8DCA9]">
                A Little More Special.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#F7F6E9]/75">
              Explore our collection and discover food products
              that bring quality and authentic taste to your table.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#E8DCA9] px-9 py-4 text-sm font-bold text-[#55532B] transition hover:bg-[#FFFEF7]"
            >
              Shop Now
              <ArrowRight size={18} />
            </Link>

          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-[#F7F6E9] py-20">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mb-12 text-center">

            <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-[#9A8540]">
              Customer Love
            </p>

            <h2 className="font-serif text-3xl font-bold text-[#55532B] sm:text-4xl">
              What Our Customers Say
            </h2>

            <p className="mt-4 text-sm text-[#77745C]">
              Your trust and satisfaction mean everything to us.
            </p>

          </div>

          <div className="mx-auto max-w-2xl rounded-3xl border border-[#E8DCA9] bg-[#FFFEF7] p-8 text-center shadow-sm sm:p-12">

            <div className="flex justify-center gap-1 text-[#B99B4B]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={19} fill="currentColor" />
              ))}
            </div>

            <p className="mt-7 font-serif text-xl italic leading-9 text-[#55532B] sm:text-2xl">
              "Your feedback matters to us. We are committed
              to bringing you a better food shopping experience
              every day."
            </p>

            <div className="mt-7">
              <p className="font-bold text-[#55532B]">
                Shreyoshi Foods
              </p>
              <p className="mt-1 text-xs text-[#9A8540]">
                Customer Experience Team
              </p>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

function SproutIcon() {
  return (
    <Leaf size={27} className="text-[#55532B]" strokeWidth={1.7} />
  );
}
