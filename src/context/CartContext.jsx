
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "shreyoshi-foods-cart";
const CHECKOUT_STORAGE_KEY = "shreyoshi-foods-checkout";

// Create a consistent cart item
const createCartItem = (product, quantity = 1) => {
  const parsedQuantity = Number(quantity);

  if (
    !product?._id ||
    !Number.isInteger(parsedQuantity) ||
    parsedQuantity < 1
  ) {
    throw new Error("Invalid product or quantity");
  }

  const regularPrice = Number(product.regularPrice || 0);
  const salePrice = Number(product.salePrice || 0);
  const price = salePrice > 0 ? salePrice : regularPrice;

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Invalid product price");
  }

  return {
    productId: String(product._id),
    name: product.name || "",
    slug: product.slug || "",
    image: product.images?.main || "",
    price,
    regularPrice,
    quantity: parsedQuantity,
  };
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [checkoutMode, setCheckoutMode] = useState("cart");
  const [hydrated, setHydrated] = useState(false);

  // Load saved data
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedCheckout = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }

      if (savedCheckout) {
        const parsedCheckout = JSON.parse(savedCheckout);

        if (Array.isArray(parsedCheckout.items)) {
          setCheckoutItems(parsedCheckout.items);
        }

        setCheckoutMode(
          parsedCheckout.mode === "buy-now" ? "buy-now" : "cart"
        );
      }
    } catch (error) {
      console.error("Cart Loading Error:", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save cart
  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Cart Saving Error:", error);
    }
  }, [cartItems, hydrated]);

  // Save checkout selection
  useEffect(() => {
    if (!hydrated) return;

    try {
      sessionStorage.setItem(
        CHECKOUT_STORAGE_KEY,
        JSON.stringify({
          items: checkoutItems,
          mode: checkoutMode,
        })
      );
    } catch (error) {
      console.error("Checkout Saving Error:", error);
    }
  }, [checkoutItems, checkoutMode, hydrated]);

  // Add product to cart
  const addToCart = useCallback((product, quantity = 1) => {
    const newItem = createCartItem(product, quantity);

    setCartItems((previous) => {
      const existing = previous.find(
        (item) => item.productId === newItem.productId
      );

      if (existing) {
        return previous.map((item) =>
          item.productId === newItem.productId
            ? {
                ...item,
                quantity: item.quantity + newItem.quantity,
              }
            : item
        );
      }

      return [...previous, newItem];
    });
  }, []);

  // Remove product
  const removeFromCart = useCallback((productId) => {
    const id = String(productId);

    setCartItems((previous) =>
      previous.filter((item) => item.productId !== id)
    );
  }, []);

  // Update quantity
  const updateQuantity = useCallback((productId, quantity) => {
    const nextQuantity = Math.floor(Number(quantity));

    if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
      return;
    }

    setCartItems((previous) =>
      previous.map((item) =>
        item.productId === String(productId)
          ? { ...item, quantity: nextQuantity }
          : item
      )
    );
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Buy Now: checkout selected product only
  const buyNow = useCallback((product, quantity = 1) => {
    const item = createCartItem(product, quantity);

    setCheckoutItems([item]);
    setCheckoutMode("buy-now");
  }, []);

  // Checkout all cart products
  const checkoutCart = useCallback(() => {
    setCheckoutItems(cartItems);
    setCheckoutMode("cart");
  }, [cartItems]);

  // Clear checkout selection
  const clearCheckout = useCallback(() => {
    setCheckoutItems([]);
    setCheckoutMode("cart");
  }, []);

  // Keep cart checkout items synchronized with cart changes
  useEffect(() => {
    if (!hydrated || checkoutMode !== "cart") return;

    setCheckoutItems(cartItems);
  }, [cartItems, checkoutMode, hydrated]);

  // Cart calculations
  const cartCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
      ),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + Number(item.price || 0) * Number(item.quantity || 0),
        0
      ),
    [cartItems]
  );

  const checkoutSubtotal = useMemo(
    () =>
      checkoutItems.reduce(
        (total, item) =>
          total + Number(item.price || 0) * Number(item.quantity || 0),
        0
      ),
    [checkoutItems]
  );

  const value = {
    cartItems,
    checkoutItems,
    checkoutMode,
    hydrated,

    cartCount,
    cartSubtotal,
    checkoutSubtotal,

    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    buyNow,
    checkoutCart,
    clearCheckout,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom Cart Hook
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
