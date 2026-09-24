import { createContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { cartApi } from "../api/cartApi";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartSubtotal, setCartSubTotal] = useState(0);

  // Helper to map backend cart item to frontend expected format
  const mapBackendCartItem = (item) => ({
    id: item.id, // backend cart item id
    productId: item?.product?.id,
    variantId: item?.variant?.id,
    name: item?.product?.name,
    image: item?.product?.media?.[0]?.url || null,
    price: item?.variant?.price,
    weight: item?.variant?.weight,
    weightLabel: item?.variant?.sku || "",
    quantity: item.quantity,
    stock: item?.variant?.stock || 0,
  });

  // Sync cart depending on auth status
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          setLoading(true);
          const backendCart = await cartApi.getCart();
          const items = backendCart?.items || [];
          setCartSubTotal(backendCart?.totalAmount);
          setCartItems(items.map(mapBackendCartItem));
        } catch (e) {
          console.error("Failed to fetch backend cart", e);
        } finally {
          setLoading(false);
        }
      } else {
        // Load from local storage
        const storedCart = localStorage.getItem("punyakoti_cart");
        if (storedCart) {
          try {
            setCartItems(JSON.parse(storedCart));
          } catch (e) {
            console.error("Failed to parse cart storage", e);
          }
        }
      }
    };
    fetchCart();
  }, [user]);

  // Save cart to localStorage (only used if guest)
  const saveLocalCart = (items) => {
    setCartItems(items);
    if (!user) {
      localStorage.setItem("punyakoti_cart", JSON.stringify(items));
    }
  };

  const addToCart = async (product, selectedWeightValue, quantity = 1) => {
    const weightOption =
      (product.variants || []).find(
        (opt) => opt.weight === selectedWeightValue,
      ) || (product.variants || [])[0];
    const itemPrice = weightOption?.price || 0;

    if (user) {
      try {
        await cartApi.addItem({
          productId: product.id,
          variantId: weightOption?.id || product.id, // backend expects variantId
          quantity: quantity,
        });
        // re-fetch cart
        const backendCart = await cartApi.getCart();
        const items = backendCart?.items || [];
        setCartSubTotal(backendCart?.totalAmount);
        setCartItems(items.map(mapBackendCartItem));
      } catch (e) {
        console.error("Failed to add item to backend cart", e);
      }
    } else {
      const existingIndex = cartItems.findIndex(
        (item) =>
          item.productId === product.id && item.weight === selectedWeightValue,
      );
      let updatedItems = [...cartItems];
      if (existingIndex > -1) {
        updatedItems[existingIndex].quantity += quantity;
      } else {
        updatedItems.push({
          productId: product.id,
          variantId: weightOption?.id || null,
          name: product.name,
          category: product.category?.name || "Uncategorized",
          image:
            (product.media || []).find((m) => m.type === "IMAGE")?.url || null,
          price: itemPrice,
          weight: selectedWeightValue,
          weightLabel: weightOption?.weight || selectedWeightValue,
          quantity: quantity,
          stock: weightOption?.stock || 0,
        });
      }
      saveLocalCart(updatedItems);
    }
  };

  const updateQuantity = async (productId, weight, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }

    if (user) {
      try {
        const itemToUpdate = cartItems.find(
          (item) => item.productId === productId && item.weight === weight,
        );
        if (itemToUpdate && itemToUpdate.id) {
          await cartApi.updateQuantity(itemToUpdate.id, quantity);
          setCartItems(
            cartItems.map((item) =>
              item.id === itemToUpdate.id ? { ...item, quantity } : item,
            ),
          );
        }
      } catch (e) {
        console.error("Failed to update quantity on backend", e);
      }
    } else {
      const updatedItems = cartItems.map((item) => {
        if (item.productId === productId && item.weight === weight) {
          return { ...item, quantity };
        }
        return item;
      });
      saveLocalCart(updatedItems);
    }
  };

  const removeFromCart = async (productId, weight) => {
    if (user) {
      try {
        const itemToRemove = cartItems.find(
          (item) => item.productId === productId && item.weight === weight,
        );
        if (itemToRemove && itemToRemove.id) {
          await cartApi.removeItem(itemToRemove.id);
          setCartItems(cartItems.filter((item) => item.id !== itemToRemove.id));
        }
      } catch (e) {
        console.error("Failed to remove item from backend", e);
      }
    } else {
      const updatedItems = cartItems.filter(
        (item) => !(item.productId === productId && item.weight === weight),
      );
      saveLocalCart(updatedItems);
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartApi.clearCart();
        setCartItems([]);
      } catch (e) {
        console.error("Failed to clear backend cart", e);
      }
    } else {
      saveLocalCart([]);
    }
  };

  const cartTotalCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTotalCount,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
