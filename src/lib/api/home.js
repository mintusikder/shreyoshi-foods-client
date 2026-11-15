
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const HERO_API = `${API_URL}/api/home/hero`;

// Get Homepage Hero Data
export const getHomeHero = async () => {
  const response = await fetch(HERO_API, {
    method: "GET",
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load hero images");
  }

  return result.data;
};

// Update Homepage Hero
export const updateHomeHero = async (formData) => {
  const response = await fetch(HERO_API, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update hero images");
  }

  return result;
};
