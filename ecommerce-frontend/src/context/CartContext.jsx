import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as cartApi from '../api/cart';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await cartApi.getCart();
      setCartItems(data.items || []);
    } catch (err) {
      console.error('Fetch Cart error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Optimistic Add To Cart
  const handleAddToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      addToast('Please log in to add items to your cart.', 'error');
      return false;
    }

    const previousItems = [...cartItems];

    // Optimistic state update
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product_id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          total: parseFloat((updated[existingIndex].price * newQty).toFixed(2))
        };
        return updated;
      } else {
        return [
          {
            cart_id: Date.now(),
            product_id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: product.image,
            category: product.category,
            stock: product.stock,
            quantity: quantity,
            total: parseFloat((parseFloat(product.price) * quantity).toFixed(2))
          },
          ...prev
        ];
      }
    });

    // Auto open drawer & toast notification
    openCart();
    addToast(`Added "${product.name}" to cart`, 'success');

    // Sync with backend
    try {
      await cartApi.addToCart(product.id, quantity);
      // Background re-fetch to ensure sync with DB IDs
      fetchCart();
      return true;
    } catch (err) {
      // Rollback on failure
      setCartItems(previousItems);
      const msg = err.response?.data?.message || 'Failed to add item to cart';
      addToast(msg, 'error');
      return false;
    }
  };

  // Update quantity
  const handleUpdateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return;

    const previousItems = [...cartItems];

    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product_id === productId
            ? { ...item, quantity, total: parseFloat((item.price * quantity).toFixed(2)) }
            : item
        )
      );
    }

    try {
      await cartApi.updateCartQuantity(productId, quantity);
    } catch (err) {
      setCartItems(previousItems);
      const msg = err.response?.data?.message || 'Failed to update quantity';
      addToast(msg, 'error');
    }
  };

  // Remove from cart
  const handleRemoveFromCart = async (productId) => {
    if (!isAuthenticated) return;

    const previousItems = [...cartItems];
    const itemToRemove = cartItems.find((item) => item.product_id === productId);

    setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
    if (itemToRemove) {
      addToast(`Removed "${itemToRemove.name}" from cart`, 'info');
    }

    try {
      await cartApi.removeFromCart(productId);
    } catch (err) {
      setCartItems(previousItems);
      addToast('Failed to remove item', 'error');
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = parseFloat(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart: handleAddToCart,
        updateQuantity: handleUpdateQuantity,
        removeFromCart: handleRemoveFromCart,
        clearCart,
        fetchCart,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
