
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getApiUrl(path) {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return `${API_URL.replace(/\/+$/, "")}${path}`;
}

async function readResponse(response) {
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Order request failed");
  }

  return result;
}

// Customer: Create Order
export async function createOrder(orderData) {
  const response = await fetch(getApiUrl("/api/orders"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(orderData),
  });

  return readResponse(response);
}

// Admin: Get All Orders
export async function getAdminOrders() {
  const response = await fetch(
    getApiUrl("/api/orders/admin/all"),
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  const result = await readResponse(response);

  return result.orders || [];
}

// Admin: Update Order Status
export async function updateOrderStatus(id, orderStatus) {
  const response = await fetch(
    getApiUrl(`/api/orders/admin/${encodeURIComponent(id)}/status`),
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ orderStatus }),
    }
  );

  return readResponse(response);
}
