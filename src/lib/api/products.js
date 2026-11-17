
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getApiUrl(path) {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return `${API_URL.replace(/\/+$/, "")}${path}`;
}

function notifyProductsUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("products-updated"));
  }
}

function buildProductFormData(productData = {}) {
  const formData = new FormData();

  Object.entries(productData).forEach(([key, value]) => {
    if (
      key === "_id" ||
      key === "mainImage" ||
      key === "galleryImages" ||
      key === "existingGalleryImages" ||
      value === undefined ||
      value === null
    ) {
      return;
    }

    if (Array.isArray(value) || typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  if (productData.mainImage instanceof File) {
    formData.append("mainImage", productData.mainImage);
  }

  if (Array.isArray(productData.galleryImages)) {
    productData.galleryImages.forEach((file) => {
      if (file instanceof File) {
        formData.append("galleryImages", file);
      }
    });
  }

  if (Array.isArray(productData.existingGalleryImages)) {
    formData.append(
      "existingGalleryImages",
      JSON.stringify(productData.existingGalleryImages)
    );
  }

  return formData;
}

async function readResponse(response, fallbackMessage) {
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || fallbackMessage);
  }

  return result;
}

// Add Product
export async function createProduct(productData) {
  const response = await fetch(getApiUrl("/api/products"), {
    method: "POST",
    body: buildProductFormData(productData),
    credentials: "include",
  });

  const result = await readResponse(response, "Product creation failed");
  notifyProductsUpdated();

  return result;
}

// Public Published Products
export async function getProducts() {
  const response = await fetch(getApiUrl("/api/products"), {
    cache: "no-store",
  });

  const result = await readResponse(response, "Failed to fetch products");

  return result.products || [];
}

// Single Published Product
export async function getProductBySlug(slug) {
  const response = await fetch(
    getApiUrl(`/api/products/${encodeURIComponent(slug)}`),
    { cache: "no-store" }
  );

  const result = await readResponse(response, "Failed to fetch product");

  return result.product || null;
}

// Admin: All Products (Published + Draft)
export async function getAdminProducts() {
  const response = await fetch(getApiUrl("/api/products/admin/all"), {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const result = await readResponse(
    response,
    "Failed to fetch admin products"
  );

  return result.products || [];
}

// Admin: Update Product
export async function updateProduct(id, productData) {
  const response = await fetch(
    getApiUrl(`/api/products/admin/${encodeURIComponent(id)}`),
    {
      method: "PUT",
      body: buildProductFormData(productData),
      credentials: "include",
    }
  );

  const result = await readResponse(response, "Product update failed");
  notifyProductsUpdated();

  return result;
}

// Admin: Delete Product
export async function deleteProduct(id) {
  const response = await fetch(
    getApiUrl(`/api/products/admin/${encodeURIComponent(id)}`),
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const result = await readResponse(response, "Product deletion failed");
  notifyProductsUpdated();

  return result;
}
