import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-price" style={{ marginTop: 'auto' }} />
    </div>
  );
};

export default SkeletonCard;
