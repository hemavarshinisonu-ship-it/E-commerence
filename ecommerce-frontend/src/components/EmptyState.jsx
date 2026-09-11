import React from 'react';
import { Heart, ShoppingBag, Search, PackageX } from 'lucide-react';

const EmptyState = ({ type = 'products', title, subtitle, actionText, onAction }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrapper">
        {type === 'wishlist' && <Heart size={36} color="var(--heart-color)" />}
        {type === 'cart' && <ShoppingBag size={36} color="var(--accent-primary)" />}
        {type === 'search' && <Search size={36} color="var(--accent-primary)" />}
        {type === 'orders' && <PackageX size={36} color="var(--accent-primary)" />}
      </div>

      <h3 className="empty-title">{title || 'No Items Found'}</h3>
      <p className="empty-subtitle">{subtitle || 'Explore our catalog to find products you will love.'}</p>

      {onAction && (
        <button onClick={onAction} className="btn-cta">
          {actionText || 'Browse Products'}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
