
"use client";

import React from "react";
import Link from "next/link";
import {
  Leaf,
  ArrowRight,
  ArrowUpRight,
  Sprout,
} from "lucide-react";

const HomeHero = () => {
  return (
    <section className="relative flex min-h-[calc(100svh-120px)] w-full items-center overflow-hidden bg-[#F7F6E9]">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#E8DCA9]/30 blur-3xl" />

      <div className="mx-auto grid w-full max-w-[1600px] items-center gap-10 px-6 py-8 sm:px-10 lg:grid-cols-2 lg:gap-12 lg:px-16 lg:py-8">

        {/* Hero Content */}
        <div className="relative z-10">

          {/* Welcome Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#55532B]/20 bg-white/70 px-4 py-2">
            <Leaf size={16} className="text-[#77743B]" />

            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#55532B]">
              Welcome to Shreyoshi Foods
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-2xl font-serif text-4xl font-bold leading-[1.08] text-[#55532B] sm:text-5xl lg:text-6xl xl:text-7xl">
            Taste the
            <span className="block italic text-[#9A8540]">
              Goodness
            </span>
            of Nature.
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#77745C] sm:text-base sm:leading-8">
            Discover the authentic taste of nature with carefully
            selected food products. Bringing quality, freshness
            and goodness to every home.
          </p>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-3">

            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 rounded-full bg-[#55532B] px-7 py-3.5 text-sm font-semibold text-[#FFFEF7] transition duration-300 hover:bg-[#77743B]"
            >
              Explore Products

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-[#55532B]/30 px-7 py-3.5 text-sm font-semibold text-[#55532B] transition duration-300 hover:bg-[#55532B] hover:text-white"
            >
              Our Story
              <ArrowUpRight size={17} />
            </Link>

          </div>

          {/* Trust Section */}
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[#55532B]/15 pt-5 sm:gap-7">

            <div>
              <p className="font-serif text-xl font-bold text-[#55532B]">
                Natural
              </p>
              <p className="mt-1 text-[11px] text-[#77745C]">
                Food Choices
              </p>
            </div>

            <div className="h-10 w-px bg-[#55532B]/20" />

            <div>
              <p className="font-serif text-xl font-bold text-[#55532B]">
                Quality
              </p>
              <p className="mt-1 text-[11px] text-[#77745C]">
                Focused Products
              </p>
            </div>

            <div className="h-10 w-px bg-[#55532B]/20" />

            <div>
              <p className="font-serif text-xl font-bold text-[#55532B]">
                Care
              </p>
              <p className="mt-1 text-[11px] text-[#77745C]">
                For Every Home
              </p>
            </div>

          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mx-auto w-full max-w-[580px] lg:ml-auto">

          {/* Image Decoration */}
          <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-[#E8DCA9]/60 blur-3xl" />

          <div className="absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-[#9A8540]/10 blur-3xl" />

          {/* Main Image */}
          <div className="relative overflow-hidden rounded-[150px_150px_24px_24px] border-[7px] border-white shadow-2xl">

            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=90"
              alt="Fresh natural food ingredients"
              className="h-[300px] w-full object-cover sm:h-[380px] lg:h-[420px]"
            />

          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-4 -left-2 flex items-center gap-3 rounded-xl bg-[#55532B] p-3 text-white shadow-xl sm:-left-6">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8DCA9] text-[#55532B]">
              <Sprout size={23} />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Nature Inspired
              </p>

              <p className="mt-1 text-[11px] text-white/70">
                Pure Taste, Every Day
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default HomeHero;
