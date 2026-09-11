import React from 'react';
import { Heart, ShoppingBag, Star, ShieldCheck } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';

const ProductCard = ({ product }) => {
  const { isLiked, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { language } = useAuth();
  const t = useTranslation(language);

  const productId = product.id || product.product_id;
  const liked = isLiked(productId) || product.liked;

  return (
    <div className="product-card">
      {/* Badge / Tag */}
      {product.badge ? (
        <span className="category-tag" style={{ background: 'var(--accent-gradient)', color: '#fff', border: 'none' }}>
          {product.badge}
        </span>
      ) : product.category ? (
        <span className="category-tag">{product.category}</span>
      ) : null}

      {/* Heart Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`wishlist-btn ${liked ? 'liked' : ''}`}
        title={liked ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
      </button>

      {/* Product Image with Hover Zoom */}
      <div className="image-container">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />

        {/* Quick Add Overlay */}
        <div className="quick-add-overlay">
          <button onClick={() => addToCart(product, 1)} className="quick-add-btn">
            <ShoppingBag size={16} />
            <span>{t('addToCart')}</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="product-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            background: '#16a34a',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: '700',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            <span>{product.rating || '4.8'}</span>
            <Star size={10} fill="#fff" color="#fff" />
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            ({product.reviews_count ? product.reviews_count.toLocaleString() : '1,240'})
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '2px', color: '#38bdf8', fontSize: '0.72rem', fontWeight: '700' }}>
            <ShieldCheck size={12} />
            <span>{t('assured')}</span>
          </div>
        </div>

        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
              {product.original_price && (
                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  ${parseFloat(product.original_price).toFixed(2)}
                </span>
              )}
              {product.discount_percent && (
                <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: '700' }}>
                  {product.discount_percent}% {t('off')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
