
"use client";

import { useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  Trash2,
  Upload,
  Save,
  RefreshCw,
  X,
  Images,
  CheckCircle2,
} from "lucide-react";

import {
  getHomeHero,
  updateHomeHero,
} from "@/lib/api/home";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_SLIDES = 3;

export default function HeroManagement() {
  const slideInputRef = useRef(null);
  const sideInputRef = useRef(null);

  const [savedSlides, setSavedSlides] = useState([]);
  const [newSlides, setNewSlides] = useState([]);

  const [sideImage, setSideImage] = useState(null);
  const [newSideImage, setNewSideImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadHero();

    return () => {
      newSlides.forEach((slide) => {
        URL.revokeObjectURL(slide.preview);
      });

      if (newSideImage?.preview) {
        URL.revokeObjectURL(newSideImage.preview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHero = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHomeHero();

      setSavedSlides(data.slides || []);
      setSideImage(data.sideImage || null);
    } catch (err) {
      setError(err.message || "Failed to load homepage images");
    } finally {
      setLoading(false);
    }
  };

  // Add one or multiple images without replacing existing images
  const handleSlideFiles = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const currentCount = savedSlides.length + newSlides.length;

    if (currentCount + files.length > MAX_SLIDES) {
      setError(
        `You can upload maximum ${MAX_SLIDES} slides. Currently ${currentCount} slides added.`
      );

      event.target.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !file.type.startsWith("image/") ||
        file.size > MAX_FILE_SIZE
    );

    if (invalidFile) {
      setError("Only image files up to 5MB are allowed.");
      event.target.value = "";
      return;
    }

    setError("");
    setSuccess("");

    const selectedSlides = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      title: "",
      subtitle: "",
      link: "",
    }));

    setNewSlides((prev) => [...prev, ...selectedSlides]);

    event.target.value = "";
  };

  // Update new slide details
  const updateNewSlide = (index, field, value) => {
    setNewSlides((prev) =>
      prev.map((slide, i) =>
        i === index
          ? { ...slide, [field]: value }
          : slide
      )
    );
  };

  // Update saved slide details
  const updateSavedSlide = (index, field, value) => {
    setSavedSlides((prev) =>
      prev.map((slide, i) =>
        i === index
          ? { ...slide, [field]: value }
          : slide
      )
    );

    setSuccess("");
  };

  // Remove existing slide
  const removeSavedSlide = (index) => {
    setSavedSlides((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setSuccess("");
  };

  // Remove newly selected slide
  const removeNewSlide = (index) => {
    setNewSlides((prev) => {
      const removed = prev[index];

      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  // Right side image selection
  const handleSideImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith("image/") ||
      file.size > MAX_FILE_SIZE
    ) {
      setError("Select an image up to 5MB.");
      event.target.value = "";
      return;
    }

    if (newSideImage?.preview) {
      URL.revokeObjectURL(newSideImage.preview);
    }

    setError("");
    setSuccess("");

    setNewSideImage({
      file,
      preview: URL.createObjectURL(file),
    });

    event.target.value = "";
  };

  // Save all hero data
  const saveHero = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const totalSlides = savedSlides.length + newSlides.length;

      if (totalSlides > MAX_SLIDES) {
        throw new Error(`Maximum ${MAX_SLIDES} slides are allowed.`);
      }

      const formData = new FormData();

      // Existing slides metadata
      const slideMetadata = savedSlides.map((slide) => ({
        image: slide.image,
        title: slide.title || "",
        subtitle: slide.subtitle || "",
        link: slide.link || "",
      }));

      // Add newly selected slides
      newSlides.forEach((slide) => {
        formData.append("slideImages", slide.file);

        slideMetadata.push({
          title: slide.title || "",
          subtitle: slide.subtitle || "",
          link: slide.link || "",
        });
      });

      formData.append("slides", JSON.stringify(slideMetadata));

      // Right side image
      if (newSideImage?.file) {
        formData.append("sideImage", newSideImage.file);
      }

      await updateHomeHero(formData);

      // Release temporary previews
      newSlides.forEach((slide) => {
        URL.revokeObjectURL(slide.preview);
      });

      if (newSideImage?.preview) {
        URL.revokeObjectURL(newSideImage.preview);
      }

      setNewSlides([]);
      setNewSideImage(null);

      if (slideInputRef.current) {
        slideInputRef.current.value = "";
      }

      if (sideInputRef.current) {
        sideInputRef.current.value = "";
      }

      await loadHero();

      setSuccess("Homepage hero updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to save homepage images");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <RefreshCw
          className="animate-spin text-[#55532B]"
          size={28}
        />
      </div>
    );
  }

  const totalSlides = savedSlides.length + newSlides.length;

  return (
    <div className="space-y-8">

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* Slider Management */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

          <div>
            <div className="flex items-center gap-2">
              <Images className="text-[#55532B]" size={22} />

              <h2 className="text-lg font-bold text-gray-800">
                Hero Slider Images
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Upload maximum 3 images, 5MB per image.
            </p>

            <p className="mt-2 text-sm font-semibold text-[#55532B]">
              {totalSlides} / {MAX_SLIDES} Slides
            </p>
          </div>

          <button
            type="button"
            onClick={() => slideInputRef.current?.click()}
            disabled={totalSlides >= MAX_SLIDES}
            className="inline-flex items-center gap-2 rounded-xl bg-[#55532B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#414021] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ImagePlus size={17} />
            Add Slide
          </button>

          <input
            ref={slideInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleSlideFiles}
          />
        </div>

        {/* Existing Slides */}
        {savedSlides.map((slide, index) => (
          <div
            key={`saved-${slide.image}-${index}`}
            className="mb-4 grid gap-4 rounded-xl border border-gray-200 p-3 sm:grid-cols-[180px_1fr]"
          >
            <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">

              <img
                src={slide.image}
                alt={slide.title || `Slide ${index + 1}`}
                className="h-full w-full object-cover"
              />

              <span className="absolute left-2 top-2 rounded-md bg-[#55532B] px-2 py-1 text-xs text-white">
                Slide {index + 1}
              </span>

              <button
                type="button"
                onClick={() => removeSavedSlide(index)}
                className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white shadow"
                aria-label="Delete slide"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-3">

              <input
                type="text"
                value={slide.title || ""}
                onChange={(e) =>
                  updateSavedSlide(index, "title", e.target.value)
                }
                placeholder="Slide title"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#55532B]"
              />

              <input
                type="text"
                value={slide.subtitle || ""}
                onChange={(e) =>
                  updateSavedSlide(index, "subtitle", e.target.value)
                }
                placeholder="Slide subtitle"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#55532B]"
              />

              <input
                type="text"
                value={slide.link || ""}
                onChange={(e) =>
                  updateSavedSlide(index, "link", e.target.value)
                }
                placeholder="Optional link"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#55532B]"
              />

            </div>
          </div>
        ))}

        {/* New Slides */}
        {newSlides.map((slide, index) => (
          <div
            key={`${slide.file.name}-${index}`}
            className="mb-4 grid gap-4 rounded-xl border border-blue-200 bg-blue-50/30 p-3 sm:grid-cols-[180px_1fr]"
          >

            <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">

              <img
                src={slide.preview}
                alt={`New slide ${index + 1}`}
                className="h-full w-full object-cover"
              />

              <span className="absolute left-2 top-2 rounded-md bg-blue-600 px-2 py-1 text-xs text-white">
                New Slide
              </span>

              <button
                type="button"
                onClick={() => removeNewSlide(index)}
                className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white"
                aria-label="Remove slide"
              >
                <X size={16} />
              </button>

            </div>

            <div className="space-y-3">

              <input
                type="text"
                value={slide.title}
                onChange={(e) =>
                  updateNewSlide(index, "title", e.target.value)
                }
                placeholder="Slide title"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#55532B]"
              />

              <input
                type="text"
                value={slide.subtitle}
                onChange={(e) =>
                  updateNewSlide(index, "subtitle", e.target.value)
                }
                placeholder="Slide subtitle"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#55532B]"
              />

              <input
                type="text"
                value={slide.link}
                onChange={(e) =>
                  updateNewSlide(index, "link", e.target.value)
                }
                placeholder="Optional link"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#55532B]"
              />

            </div>
          </div>
        ))}

        {/* Empty State */}
        {totalSlides === 0 && (
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-10 text-center">

            <ImagePlus
              className="mx-auto text-gray-400"
              size={35}
            />

            <p className="mt-3 font-medium text-gray-600">
              No slider images uploaded
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Add images to display them on your homepage.
            </p>

          </div>
        )}

      </section>

      {/* Right Side Image */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            Right Side Image
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            This image appears beside the main slider on desktop.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-[240px_1fr] sm:items-center">

          <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F7F6E9]">

            {newSideImage?.preview || sideImage?.image ? (
              <img
                src={newSideImage?.preview || sideImage.image}
                alt="Right side banner"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-gray-400">
                <ImagePlus size={35} />
                <span className="mt-2 text-sm">
                  No image uploaded
                </span>
              </div>
            )}

          </div>

          <div>

            <button
              type="button"
              onClick={() => sideInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-[#55532B] px-4 py-2.5 text-sm font-semibold text-[#55532B] transition hover:bg-[#F7F6E9]"
            >
              <Upload size={17} />
              {sideImage || newSideImage ? "Replace Image" : "Upload Image"}
            </button>

            <input
              ref={sideInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleSideImage}
            />

            <p className="mt-3 text-xs text-gray-500">
              JPG, PNG or WebP. Maximum 5MB.
            </p>

          </div>
        </div>

      </section>

      {/* Save Button */}
      <div className="flex justify-end">

        <button
          type="button"
          onClick={saveHero}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#55532B] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#414021] disabled:cursor-not-allowed disabled:opacity-60"
        >

          {saving ? (
            <RefreshCw className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}

          {saving ? "Saving..." : "Save Changes"}

        </button>

      </div>

    </div>
  );
}
