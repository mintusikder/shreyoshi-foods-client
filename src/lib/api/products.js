const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createProduct(productData) {
  const formData = new FormData();

  // Text and other fields
  Object.entries(productData).forEach(([key, value]) => {
    if (key === "mainImage" || key === "galleryImages") {
      return;
    }

    formData.append(key, String(value ?? ""));
  });

  // Main image
  formData.append("mainImage", productData.mainImage);

  // Gallery images
  productData.galleryImages.forEach((image) => {
    formData.append("galleryImages", image);
  });

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