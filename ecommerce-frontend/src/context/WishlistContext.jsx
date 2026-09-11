import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as wishlistApi from '../api/wishlist';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await wishlistApi.getWishlist();
      setWishlistItems(data || []);
    } catch (err) {
      console.error('Fetch Wishlist Error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Set of liked product IDs for quick lookup
  const wishlistIds = useMemo(() => {
    return new Set(wishlistItems.map((item) => item.product_id || item.id));
  }, [wishlistItems]);

  const isLiked = (productId) => wishlistIds.has(productId);

  // Optimistic Toggle Wishlist (Heart click)
  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      addToast('Please sign in to save items to your wishlist.', 'error');
      return false;
    }

    const productId = product.id || product.product_id;
    const currentlyLiked = wishlistIds.has(productId);
    const previousItems = [...wishlistItems];

    if (currentlyLiked) {
      // Optimistically remove
      setWishlistItems((prev) => prev.filter((item) => (item.product_id || item.id) !== productId));
      addToast(`Removed "${product.name}" from wishlist`, 'info');

      try {
        await wishlistApi.removeFromWishlist(productId);
      } catch (err) {
        setWishlistItems(previousItems);
        addToast('Failed to update wishlist', 'error');
      }
    } else {
      // Optimistically add
      const newItem = {
        wishlist_id: Date.now(),
        product_id: productId,
        id: productId,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        category: product.category,
        description: product.description,
        stock: product.stock,
        liked: true
      };

      setWishlistItems((prev) => [newItem, ...prev]);
      addToast(`Added "${product.name}" to wishlist ❤️`, 'success');

      try {
        await wishlistApi.addToWishlist(productId);
      } catch (err) {
        setWishlistItems(previousItems);
        addToast('Failed to add to wishlist', 'error');
      }
    }
  };

  // Quick "Move to Cart" button from wishlist page
  const moveToCart = async (product) => {
    const productId = product.product_id || product.id;
    const added = await addToCart(product, 1);
    if (added) {
      // Remove from wishlist
      toggleWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistIds,
        wishlistCount: wishlistItems.length,
        isLiked,
        toggleWishlist,
        moveToCart,
        fetchWishlist,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
