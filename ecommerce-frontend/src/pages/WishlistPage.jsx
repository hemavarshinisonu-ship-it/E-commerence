import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';

const WishlistPage = ({ setCurrentPage }) => {
  const { wishlistItems, moveToCart, toggleWishlist, wishlistCount, loading } = useWishlist();

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <Heart size={28} color="var(--heart-color)" fill="var(--heart-color)" />
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Wishlist ({wishlistCount})</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Your saved favorites. Move them directly into your cart whenever you are ready to purchase.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <EmptyState
          type="wishlist"
          title="Your Wishlist is Empty"
          subtitle="Keep track of products you love by clicking the heart icon on any item."
          actionText="Explore Products"
          onAction={() => setCurrentPage('home')}
        />
      ) : (
        <div className="product-grid">
          {wishlistItems.map((item) => (
            <div key={item.wishlist_id || item.product_id} style={{ position: 'relative' }}>
              <ProductCard product={item} />
              
              {/* Quick Move to Cart Bar */}
              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => moveToCart(item)}
                  className="quick-add-btn"
                  style={{ flex: 1 }}
                >
                  <ShoppingBag size={16} />
                  <span>Move to Cart</span>
                </button>
                <button
                  onClick={() => toggleWishlist(item)}
                  className="nav-item"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
