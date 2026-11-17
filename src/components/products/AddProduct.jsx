
"use client";

import { useEffect, useState } from "react";
import {
  X,
  Upload,
  ImagePlus,
  Trash2,
  Save,
  Package,
  Loader2,
} from "lucide-react";

const initialForm = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  sku: "",
  category: "",
  brand: "Shreyoshi Foods",

  regularPrice: "",
  salePrice: "",
  costPrice: "",
  stockQuantity: "",
  lowStockLimit: "5",
  stockStatus: "in-stock",

  weightVolume: "",
  packagingType: "",
  ingredients: "",
  benefits: "",
  expiryDate: "",
  storageInstructions: "",

  productWeight: "",
  deliveryCharge: "",
  freeShipping: false,

  metaTitle: "",
  metaDescription: "",
  featured: false,
  status: "draft",
};

const categories = [
  "Mustard Oil",
  "Honey",
  "Ghee",
  "Rice & Pulses",
  "Spices",
  "Dry Fruits",
  "Combo",
  "Organic Foods",
  "Popular",
  "All Products",
];

function getDateValue(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0];
}

function getInitialForm(product) {
  if (!product) return initialForm;

  return {
    ...initialForm,
    ...product,
    expiryDate: getDateValue(product.expiryDate),
    freeShipping: Boolean(product.freeShipping),
    featured: Boolean(product.featured),
    status: product.status || "draft",
  };
}

export default function AddProductModal({
  open,
  onClose,
  onSave,
  product = null,
}) {
  const isEdit = Boolean(product);

  const [form, setForm] = useState(initialForm);
  const [mainFile, setMainFile] = useState(null);
  const [mainPreview, setMainPreview] = useState("");
  const [gallery, setGallery] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setForm(getInitialForm(product));
    setMainFile(null);
    setMainPreview(product?.images?.main || "");
    setGallery(
      (product?.images?.gallery || []).map((url, index) => ({
        id: `existing-${index}`,
        file: null,
        preview: url,
        existing: true,
      }))
    );
    setError("");
  }, [open, product]);

  useEffect(() => {
    return () => {
      if (mainPreview.startsWith("blob:")) {
        URL.revokeObjectURL(mainPreview);
      }

      gallery.forEach((item) => {
        if (!item.existing && item.preview.startsWith("blob:")) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [mainPreview, gallery]);

  if (!open) return null;

  const updateField = (name, value) => {
    setForm((previous) => {
      const updated = { ...previous, [name]: value };

      if (name === "name") {
        updated.slug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      }

      return updated;
    });
  };

  const handleMainImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Main image must be smaller than 5MB.");
      return;
    }

    if (mainPreview.startsWith("blob:")) {
      URL.revokeObjectURL(mainPreview);
    }

    setMainFile(file);
    setMainPreview(URL.createObjectURL(file));
    setError("");
    event.target.value = "";
  };

  const handleGalleryImages = (event) => {
    const files = Array.from(event.target.files || []);

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} is larger than 5MB.`);
        return false;
      }

      return true;
    });

    setGallery((previous) => [
      ...previous,
      ...validFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        existing: false,
      })),
    ]);

    event.target.value = "";
  };

  const removeGalleryImage = (id) => {
    setGallery((previous) => {
      const item = previous.find((image) => image.id === id);

      if (item && !item.existing && item.preview.startsWith("blob:")) {
        URL.revokeObjectURL(item.preview);
      }

      return previous.filter((image) => image.id !== id);
    });
  };

  const handleSubmit = async (event, status) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (!isEdit && !mainFile) {
      setError("Please select a main product image.");
      return;
    }

    if (isEdit && !mainFile && !product?.images?.main) {
      setError("Please select a main product image.");
      return;
    }

    const regularPrice = Number(form.regularPrice);

    if (!Number.isFinite(regularPrice) || regularPrice <= 0) {
      setError("Please enter a valid regular price.");
      return;
    }

    const productData = {
      ...form,
      status,
      regularPrice,
      salePrice: form.salePrice === "" ? "" : Number(form.salePrice),
      costPrice: form.costPrice === "" ? "" : Number(form.costPrice),
      stockQuantity: Number(form.stockQuantity || 0),
      lowStockLimit: Number(form.lowStockLimit || 0),
      deliveryCharge: Number(form.deliveryCharge || 0),
      productWeight: Number(form.productWeight || 0),
      freeShipping: Boolean(form.freeShipping),
      featured: Boolean(form.featured),

      mainImage: mainFile,
      galleryImages: gallery
        .filter((item) => !item.existing && item.file)
        .map((item) => item.file),

      existingGalleryImages: gallery
        .filter((item) => item.existing)
        .map((item) => item.preview),
    };

    try {
      setSaving(true);
      await onSave(productData);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#55532B] focus:ring-2 focus:ring-[#55532B]/10";

  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  const sectionClass =
    "rounded-xl border border-gray-100 bg-white p-4 sm:p-5";

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 p-3 sm:p-6">
      <div className="my-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-[#F7F6E9] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#55532B]/10 p-2 text-[#55532B]">
              <Package size={21} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isEdit ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-xs text-gray-500">
                {isEdit
                  ? "Update your product information"
                  : "Add a new product to your store"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-red-500"
          >
            <X size={21} />
          </button>
        </div>

        <form className="space-y-5 p-4 sm:p-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <section className={sectionClass}>
            <h3 className="mb-4 font-semibold text-gray-900">
              Basic Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Product Name *</label>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className={labelClass}>Slug</label>
                <input
                  className={inputClass}
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="product-slug"
                />
              </div>

              <div>
                <label className={labelClass}>SKU</label>
                <input
                  className={inputClass}
                  value={form.sku}
                  onChange={(e) => updateField("sku", e.target.value)}
                  placeholder="e.g. SF-001"
                />
              </div>

              <div>
                <label className={labelClass}>Category *</label>
                <select
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Brand</label>
                <input
                  className={inputClass}
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>Short Description</label>
                <input
                  className={inputClass}
                  value={form.shortDescription}
                  onChange={(e) =>
                    updateField("shortDescription", e.target.value)
                  }
                  placeholder="Short product description"
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Full Description</label>
                <textarea
                  rows={4}
                  className={inputClass}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Write product details..."
                />
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <h3 className="mb-4 font-semibold text-gray-900">
              Product Images
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Main Product Image *</label>

                <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center transition hover:border-[#55532B]">
                  {mainPreview ? (
                    <img
                      src={mainPreview}
                      alt="Main product preview"
                      className="h-48 w-full object-contain p-2"
                    />
                  ) : (
                    <>
                      <Upload size={28} className="mb-2 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">
                        Upload Main Image
                      </span>
                      <span className="mt-1 text-xs text-gray-400">
                        PNG, JPG, WEBP · Max 5MB
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMainImage}
                  />
                </label>
                {mainPreview && (
                  <p className="mt-2 text-xs text-gray-500">
                    Select the image again to replace it.
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Gallery Images</label>

                <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center transition hover:border-[#55532B]">
                  <ImagePlus size={28} className="mb-2 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Add Gallery Images
                  </span>
                  <span className="mt-1 text-xs text-gray-400">
                    You can select multiple images
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryImages}
                  />
                </label>

                {gallery.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {gallery.map((item) => (
                      <div
                        key={item.id}
                        className="group relative overflow-hidden rounded-lg border bg-white"
                      >
                        <img
                          src={item.preview}
                          alt="Gallery preview"
                          className="h-20 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(item.id)}
                          className="absolute right-1 top-1 rounded-md bg-red-500 p-1 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <h3 className="mb-4 font-semibold text-gray-900">
              Pricing & Inventory
            </h3>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["regularPrice", "Regular Price *"],
                ["salePrice", "Sale Price"],
                ["costPrice", "Cost Price"],
                ["stockQuantity", "Stock Quantity"],
                ["lowStockLimit", "Low Stock Limit"],
                ["deliveryCharge", "Delivery Charge"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className={labelClass}>{label}</label>
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={form[name]}
                    onChange={(e) => updateField(name, e.target.value)}
                    placeholder="0"
                  />
                </div>
              ))}

              <div>
                <label className={labelClass}>Stock Status</label>
                <select
                  className={inputClass}
                  value={form.stockStatus}
                  onChange={(e) => updateField("stockStatus", e.target.value)}
                >
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="low-stock">Low Stock</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  id="freeShipping"
                  type="checkbox"
                  checked={form.freeShipping}
                  onChange={(e) =>
                    updateField("freeShipping", e.target.checked)
                  }
                  className="h-4 w-4 accent-[#55532B]"
                />
                <label
                  htmlFor="freeShipping"
                  className="text-sm text-gray-700"
                >
                  Free Shipping
                </label>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <h3 className="mb-4 font-semibold text-gray-900">
              Product Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["weightVolume", "Weight / Volume"],
                ["packagingType", "Packaging Type"],
                ["ingredients", "Ingredients"],
                ["benefits", "Benefits"],
                ["productWeight", "Product Weight"],
                ["expiryDate", "Expiry Date"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className={labelClass}>{label}</label>
                  <input
                    type={name === "expiryDate" ? "date" : "text"}
                    className={inputClass}
                    value={form[name] ?? ""}
                    onChange={(e) => updateField(name, e.target.value)}
                    placeholder={label}
                  />
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className={labelClass}>Storage Instructions</label>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={form.storageInstructions}
                  onChange={(e) =>
                    updateField("storageInstructions", e.target.value)
                  }
                  placeholder="Storage instructions..."
                />
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <h3 className="mb-4 font-semibold text-gray-900">
              SEO & Publishing
            </h3>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Meta Title</label>
                <input
                  className={inputClass}
                  value={form.metaTitle}
                  onChange={(e) => updateField("metaTitle", e.target.value)}
                  placeholder="SEO title"
                />
              </div>

              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={form.metaDescription}
                  onChange={(e) =>
                    updateField("metaDescription", e.target.value)
                  }
                  placeholder="SEO description"
                />
              </div>

              <div className="flex flex-wrap gap-5">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      updateField("featured", e.target.checked)
                    }
                    className="h-4 w-4 accent-[#55532B]"
                  />
                  Featured Product
                </label>
              </div>
            </div>
          </section>

          <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white p-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={(event) => handleSubmit(event, "draft")}
              className="rounded-lg border border-[#55532B] px-5 py-2.5 text-sm font-semibold text-[#55532B] hover:bg-[#55532B]/5 disabled:opacity-50"
            >
              Save as Draft
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={(event) => handleSubmit(event, "published")}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#55532B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#414020] disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {saving
                ? "Saving..."
                : isEdit
                  ? "Update Product"
                  : "Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
