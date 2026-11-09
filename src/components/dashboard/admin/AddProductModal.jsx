
"use client";

import { useEffect, useState } from "react";
import {
  X,
  Upload,
  ImagePlus,
  Trash2,
  Package,
  Save,
  Send,
  Info,
  Tag,
  Truck,
  Search,
  Image as ImageIcon,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-[#E8E5D3] bg-white px-4 py-3 text-sm text-[#292817] outline-none transition placeholder:text-[#AAA895] focus:border-[#55532B] focus:ring-2 focus:ring-[#55532B]/10";

const labelClass =
  "mb-2 block text-sm font-semibold text-[#55532B]";

const initialForm = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  sku: "",
  category: "",
  brand: "",

  regularPrice: "",
  salePrice: "",
  costPrice: "",
  stockQuantity: "",
  lowStockLimit: "10",
  stockStatus: "in_stock",

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

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-[#EAE8D9] bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDEEDC] text-[#55532B]">
          <Icon size={19} />
        </div>

        <div>
          <h3 className="font-bold text-[#292817]">{title}</h3>
          <p className="mt-1 text-xs text-[#999781]">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

function Field({ label, required, children, hint }) {
  return (
    <div>
      <label className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 text-xs text-[#999781]">{hint}</p>
      )}
    </div>
  );
}

export default function AddProductModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(initialForm);
  const [mainImage, setMainImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (mainImage?.preview) URL.revokeObjectURL(mainImage.preview);
      gallery.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [mainImage, gallery]);

  if (!open) return null;

  const updateField = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    if (key === "name") {
      setForm((previous) => ({
        ...previous,
        name: value,
        slug: value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      }));
    }

    setMessage("");
  };

  const handleMainImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      return;
    }

    if (mainImage?.preview) {
      URL.revokeObjectURL(mainImage.preview);
    }

    setMainImage({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleGallery = (files) => {
    const selectedFiles = Array.from(files);

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setGallery((previous) => [...previous, ...newImages]);
  };

  const removeGalleryImage = (index) => {
    setGallery((previous) => {
      const selected = previous[index];
      URL.revokeObjectURL(selected.preview);

      return previous.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (event, status) => {
    event.preventDefault();
    setMessage("");

    if (!form.name.trim() || !form.category || !form.regularPrice || !form.stockQuantity || !mainImage) {
      setMessage("Please complete all required fields and select a main image.");
      return;
    }

    if (Number(form.regularPrice) <= 0 || Number(form.stockQuantity) < 0) {
      setMessage("Please enter a valid price and stock quantity.");
      return;
    }

    if (
      form.salePrice &&
      Number(form.salePrice) > Number(form.regularPrice)
    ) {
      setMessage("Sale price cannot be greater than regular price.");
      return;
    }

    const productData = {
      ...form,
      status,
      mainImage: mainImage.file,
      galleryImages: gallery.map((item) => item.file),
      regularPrice: Number(form.regularPrice),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      costPrice: form.costPrice ? Number(form.costPrice) : null,
      stockQuantity: Number(form.stockQuantity),
      lowStockLimit: Number(form.lowStockLimit || 0),
      deliveryCharge: form.deliveryCharge
        ? Number(form.deliveryCharge)
        : 0,
      freeShipping: form.freeShipping,
      featured: form.featured,
    };

    if (!onSave) {
      setMessage("Form is ready. Connect the product API to save it to your store.");
      return;
    }

    try {
      setSaving(true);
      await onSave(productData);
      setForm(initialForm);
      setMainImage(null);
      setGallery([]);
      onClose();
    } catch (error) {
      setMessage(error.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-2 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-[#F7F6E9] shadow-2xl sm:max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#EAE8D9] bg-white px-5 py-4 sm:px-7">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDEEDC] text-[#55532B]">
                <Package size={19} />
              </div>
              <h2 className="text-lg font-bold text-[#292817] sm:text-xl">
                Add New Product
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#999781]">
              Create and manage your store product.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#77754E] transition hover:bg-[#F1F0E7]"
          >
            <X size={21} />
          </button>
        </div>

        {/* Modal Content */}
        <form
          onSubmit={(event) => handleSubmit(event, form.status)}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-5 p-4 sm:p-7">

            {/* 1. Basic Information */}
            <Section
              icon={Info}
              title="Basic Information"
              description="Enter the main information about your product."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Product Name" required>
                  <input
                    className={inputClass}
                    placeholder="e.g. Premium Mustard Oil"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                  />
                </Field>

                <Field label="Product Slug" hint="Automatically generated from product name.">
                  <input
                    className={`${inputClass} bg-[#F7F6E9]`}
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="premium-mustard-oil"
                  />
                </Field>

                <Field label="Product SKU / Unique ID">
                  <input
                    className={inputClass}
                    placeholder="e.g. SMO-001"
                    value={form.sku}
                    onChange={(e) => updateField("sku", e.target.value)}
                  />
                </Field>

                <Field label="Brand">
                  <input
                    className={inputClass}
                    placeholder="e.g. Shreyoshi Foods"
                    value={form.brand}
                    onChange={(e) => updateField("brand", e.target.value)}
                  />
                </Field>

                <Field label="Category" required>
                  <select
                    className={inputClass}
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Mustard Oil">Mustard Oil</option>
                    <option value="Ghee">Ghee</option>
                    <option value="Honey">Honey</option>
                    <option value="Spices">Spices</option>
                    <option value="Rice">Rice</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>

                <Field label="Short Description">
                  <textarea
                    rows={2}
                    className={inputClass}
                    placeholder="Write a short product description..."
                    value={form.shortDescription}
                    onChange={(e) => updateField("shortDescription", e.target.value)}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Full Description">
                    <textarea
                      rows={5}
                      className={inputClass}
                      placeholder="Write complete product details..."
                      value={form.description}
                      onChange={(e) => updateField("description", e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            </Section>

            {/* 2. Product Images */}
            <Section
              icon={ImageIcon}
              title="Product Images"
              description="Upload a main image and additional gallery images."
            >
              <div className="grid gap-6 md:grid-cols-2">
                {/* Main Image */}
                <div>
                  <Field label="Main Product Image" required>
                    <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#D9D6C2] bg-[#FFFEF7] p-4 text-center transition hover:border-[#55532B]">
                      {mainImage ? (
                        <img
                          src={mainImage.preview}
                          alt="Main product preview"
                          className="h-44 w-full rounded-lg object-contain"
                        />
                      ) : (
                        <>
                          <Upload size={30} className="mb-3 text-[#77754E]" />
                          <span className="text-sm font-semibold text-[#55532B]">
                            Click to upload main image
                          </span>
                          <span className="mt-1 text-xs text-[#999781]">
                            PNG, JPG or WEBP
                          </span>
                        </>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleMainImage(e.target.files?.[0])}
                      />
                    </label>
                  </Field>

                  {mainImage && (
                    <div className="mt-2 flex items-center justify-between">
                      <span className="truncate text-xs text-[#77754E]">
                        {mainImage.file.name}
                      </span>
                      <div className="flex gap-2">
                        <label className="cursor-pointer text-xs font-semibold text-[#55532B]">
                          Replace
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleMainImage(e.target.files?.[0])}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setMainImage(null)}
                          className="text-xs font-semibold text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gallery */}
                <div>
                  <Field label="Gallery Images (Multiple)">
                    <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D9D6C2] bg-[#FFFEF7] p-4 text-center transition hover:border-[#55532B]">
                      <ImagePlus size={30} className="mb-3 text-[#77754E]" />
                      <span className="text-sm font-semibold text-[#55532B]">
                        Upload gallery images
                      </span>
                      <span className="mt-1 text-xs text-[#999781]">
                        Select multiple images
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          handleGallery(e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </Field>

                  {gallery.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {gallery.map((item, index) => (
                        <div
                          key={item.preview}
                          className="group relative aspect-square overflow-hidden rounded-lg border border-[#EAE8D9]"
                        >
                          <img
                            src={item.preview}
                            alt={`Gallery ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-red-500 shadow"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Section>

            {/* 3. Pricing & Inventory */}
            <Section
              icon={Tag}
              title="Pricing & Inventory"
              description="Set product prices and manage available stock."
            >
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Regular Price (৳)" required>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={inputClass}
                    placeholder="450"
                    value={form.regularPrice}
                    onChange={(e) => updateField("regularPrice", e.target.value)}
                    required
                  />
                </Field>

                <Field label="Sale Price (৳)">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={inputClass}
                    placeholder="400"
                    value={form.salePrice}
                    onChange={(e) => updateField("salePrice", e.target.value)}
                  />
                </Field>

                <Field label="Cost Price (৳) - Admin Only">
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    placeholder="300"
                    value={form.costPrice}
                    onChange={(e) => updateField("costPrice", e.target.value)}
                  />
                </Field>

                <Field label="Stock Quantity" required>
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    placeholder="100"
                    value={form.stockQuantity}
                    onChange={(e) => updateField("stockQuantity", e.target.value)}
                    required
                  />
                </Field>

                <Field label="Low Stock Alert Limit">
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={form.lowStockLimit}
                    onChange={(e) => updateField("lowStockLimit", e.target.value)}
                  />
                </Field>

                <Field label="Stock Status">
                  <select
                    className={inputClass}
                    value={form.stockStatus}
                    onChange={(e) => updateField("stockStatus", e.target.value)}
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </Field>
              </div>
            </Section>

            {/* 4. Product Details */}
            <Section
              icon={Package}
              title="Product Details"
              description="Add specifications and product information."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Weight / Volume">
                  <input
                    className={inputClass}
                    placeholder="e.g. 500ml, 1L, 5kg"
                    value={form.weightVolume}
                    onChange={(e) => updateField("weightVolume", e.target.value)}
                  />
                </Field>

                <Field label="Packaging Type">
                  <input
                    className={inputClass}
                    placeholder="e.g. Glass Bottle, Plastic Jar"
                    value={form.packagingType}
                    onChange={(e) => updateField("packagingType", e.target.value)}
                  />
                </Field>

                <Field label="Ingredients">
                  <textarea
                    rows={3}
                    className={inputClass}
                    placeholder="Enter ingredients separated by commas..."
                    value={form.ingredients}
                    onChange={(e) => updateField("ingredients", e.target.value)}
                  />
                </Field>

                <Field label="Benefits">
                  <textarea
                    rows={3}
                    className={inputClass}
                    placeholder="Enter product benefits..."
                    value={form.benefits}
                    onChange={(e) => updateField("benefits", e.target.value)}
                  />
                </Field>

                <Field label="Expiry Date">
                  <input
                    type="date"
                    className={inputClass}
                    value={form.expiryDate}
                    onChange={(e) => updateField("expiryDate", e.target.value)}
                  />
                </Field>

                <Field label="Storage Instructions">
                  <textarea
                    rows={2}
                    className={inputClass}
                    placeholder="e.g. Store in a cool and dry place"
                    value={form.storageInstructions}
                    onChange={(e) => updateField("storageInstructions", e.target.value)}
                  />
                </Field>
              </div>
            </Section>

            {/* 5. Shipping */}
            <Section
              icon={Truck}
              title="Shipping Information"
              description="Configure product shipping preferences."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Product Weight (kg)">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={inputClass}
                    placeholder="1"
                    value={form.productWeight}
                    onChange={(e) => updateField("productWeight", e.target.value)}
                  />
                </Field>

                <Field label="Delivery Charge (৳)">
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    placeholder="60"
                    value={form.deliveryCharge}
                    onChange={(e) => updateField("deliveryCharge", e.target.value)}
                  />
                </Field>

                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#EAE8D9] bg-[#FFFEF7] p-4">
                    <input
                      type="checkbox"
                      checked={form.freeShipping}
                      onChange={(e) => updateField("freeShipping", e.target.checked)}
                      className="h-4 w-4 accent-[#55532B]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-[#55532B]">
                        Free Shipping
                      </span>
                      <span className="mt-1 block text-xs text-[#999781]">
                        Enable free delivery for this product.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </Section>

            {/* 6. SEO & Publishing */}
            <Section
              icon={Search}
              title="SEO & Publishing"
              description="Optimize your product for search engines and publishing."
            >
              <div className="space-y-5">
                <Field label="Meta Title">
                  <input
                    className={inputClass}
                    placeholder="Product SEO title"
                    value={form.metaTitle}
                    onChange={(e) => updateField("metaTitle", e.target.value)}
                  />
                </Field>

                <Field label="Meta Description">
                  <textarea
                    rows={3}
                    maxLength={300}
                    className={inputClass}
                    placeholder="Write an SEO description..."
                    value={form.metaDescription}
                    onChange={(e) => updateField("metaDescription", e.target.value)}
                  />
                  <p className="mt-1 text-right text-xs text-[#999781]">
                    {form.metaDescription.length}/300
                  </p>
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#EAE8D9] bg-[#FFFEF7] p-4">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => updateField("featured", e.target.checked)}
                      className="h-4 w-4 accent-[#55532B]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-[#55532B]">
                        Featured Product
                      </span>
                      <span className="mt-1 block text-xs text-[#999781]">
                        Show as a featured product.
                      </span>
                    </span>
                  </label>

                  <Field label="Product Status">
                    <select
                      className={inputClass}
                      value={form.status}
                      onChange={(e) => updateField("status", e.target.value)}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </Field>
                </div>
              </div>
            </Section>

            {message && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                {message}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[#EAE8D9] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#EAE8D9] px-5 py-3 text-sm font-semibold text-[#77754E] transition hover:bg-[#F7F6E9]"
            >
              Cancel
            </button>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={saving}
                onClick={(event) => handleSubmit(event, "draft")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#55532B] px-5 py-3 text-sm font-semibold text-[#55532B] transition hover:bg-[#EDEEDC] disabled:opacity-50"
              >
                <Save size={16} />
                Save as Draft
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={(event) => handleSubmit(event, "published")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#55532B] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#424021] disabled:opacity-50"
              >
                <Send size={16} />
                {saving ? "Saving..." : "Publish Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
