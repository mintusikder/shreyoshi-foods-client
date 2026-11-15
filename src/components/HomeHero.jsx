
"use client";

import { useEffect, useState } from "react";
import {
  Leaf,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Heart,
} from "lucide-react";

import { getHomeHero } from "@/lib/api/home";

const features = [
  {
    icon: Leaf,
    title: "Natural",
    subtitle: "Food Choices",
  },
  {
    icon: ShieldCheck,
    title: "Quality",
    subtitle: "Focused Products",
  },
  {
    icon: Heart,
    title: "Care",
    subtitle: "For Every Home",
  },
];

export default function HomeHero() {
  const [slides, setSlides] = useState([]);
  const [sideImage, setSideImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load hero images from backend
  useEffect(() => {
    let active = true;

    const loadHero = async () => {
      try {
        const data = await getHomeHero();

        if (!active) return;

        setSlides(data.slides || []);
        setSideImage(data.sideImage || null);
      } catch (error) {
        console.error("Homepage Hero Error:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadHero();

    return () => {
      active = false;
    };
  }, []);

  // Reset current slide when slides change
  useEffect(() => {
    setCurrentSlide(0);
  }, [slides.length]);

  // Auto slider
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    if (!slides.length) return;

    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (!slides.length) return;

    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="w-full overflow-hidden bg-[#FAF7EF]">
      <div className="mx-auto w-full max-w-[1900px] px-2 pb-2 pt-2 sm:px-4 lg:px-8 lg:pb-2 lg:pt-3 xl:px-10">

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 items-center gap-0 lg:grid-cols-[2fr_1fr] lg:gap-5 xl:gap-7">

          {/* Main Slider */}
          <div className="group relative aspect-[1.5/1] w-full overflow-hidden rounded-lg bg-[#E8DCA9] shadow-sm sm:rounded-xl lg:h-[min(48vh,380px)] lg:aspect-auto lg:rounded-[16px] lg:shadow-md">

            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-[#55532B]">
                Loading homepage...
              </div>
            ) : slides.length > 0 ? (
              <>
                {slides.map((slide, index) => (
                  <div
                    key={`${slide.image}-${index}`}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      currentSlide === index
                        ? "z-10 opacity-100"
                        : "z-0 opacity-0"
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title || "Shreyoshi Foods"}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
                  </div>
                ))}

                {/* Slider Controls */}
                {slides.length > 1 && (
                  <>
                    <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 sm:bottom-6 sm:right-6 sm:gap-2">
                      <button
                        onClick={prevSlide}
                        aria-label="Previous slide"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/50 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#55532B] sm:h-10 sm:w-10"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <button
                        onClick={nextSlide}
                        aria-label="Next slide"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/50 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#55532B] sm:h-10 sm:w-10"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    {/* Indicators */}
                    <div className="absolute bottom-5 left-4 z-20 flex gap-1.5 sm:bottom-8 sm:left-8 sm:gap-2">
                      {slides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          aria-label={`Go to slide ${index + 1}`}
                          className={`h-1.5 rounded-full transition-all sm:h-2 ${
                            currentSlide === index
                              ? "w-6 bg-[#E8DCA9] sm:w-8"
                              : "w-1.5 bg-white/70 sm:w-2"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-4 text-center text-[#55532B]">
                <Leaf size={35} />

                <h2 className="mt-3 text-lg font-bold">
                  Welcome to Shreyoshi Foods
                </h2>

                <p className="mt-1 text-sm">
                  Homepage slider images will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Right Side Image - Desktop Only */}
          <div className="relative hidden h-[min(48vh,380px)] overflow-hidden rounded-[16px] bg-[#E8DCA9] shadow-md lg:block">

            {sideImage?.image ? (
              <>
                <img
                  src={sideImage.image}
                  alt="Shreyoshi Foods organic products"
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-[#55532B]">
                <Leaf size={35} />

                <p className="mt-3 text-sm font-medium">
                  Right side image will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-2 grid grid-cols-3 divide-x divide-[#E6DDCE] overflow-hidden rounded-lg border border-[#E6DDCE] bg-white shadow-sm sm:mt-3 lg:mt-5 lg:h-[95px] lg:rounded-[16px]">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="flex min-w-0 flex-col items-center justify-center gap-1 px-1 py-2.5 sm:gap-2 sm:py-4 lg:gap-2 lg:py-3"
              >
                <Icon
                  size={18}
                  className="shrink-0 text-[#C58B23] sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                  strokeWidth={1.8}
                />

                <div className="text-center">
                  <h3 className="whitespace-nowrap text-[9px] font-bold text-[#55532B] sm:text-xs lg:text-sm">
                    {feature.title}
                  </h3>

                  <p className="whitespace-nowrap text-[8px] text-[#77745A] sm:text-[10px] lg:text-xs">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
