
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create Product
export async function createProduct(productData) {
  const formData = new FormData();

  // Text and other fields
  Object.entries(productData).forEach(([key, value]) => {
    if (key === "mainImage" || key === "galleryImages") {
      return;
    }

    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  // Main Image
  if (productData.mainImage instanceof File) {
    formData.append("mainImage", productData.mainImage);
  }

  // Gallery Images
  if (productData.galleryImages?.length) {
    productData.galleryImages.forEach((image) => {
      if (image instanceof File) {
        formData.append("galleryImages", image);
      }
    });
  }

  const response = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Product creation failed");
  }

  return result;
}

// Get All Products
export async function getProducts() {
  const response = await fetch(`${API_URL}/api/products`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch products");
  }

  return result.products || [];
}

// Get Single Product by Slug
export async function getProductBySlug(slug) {
  const response = await fetch(
    `${API_URL}/api/products/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch product");
  }

  return result.product;
}
