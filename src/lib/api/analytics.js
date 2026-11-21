const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getApiUrl(path) {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return `${API_URL.replace(/\/+$/, "")}${path}`;
}

export async function getAnalytics({
  range = "30d",
  from,
  to,
} = {}) {
  const params = new URLSearchParams({ range });

  if (range === "custom") {
    if (from) params.set("from", from);
    if (to) params.set("to", to);
  }

  const response = await fetch(
    getApiUrl(`/api/analytics?${params.toString()}`),
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Analytics data load failed");
  }

  return result;
}