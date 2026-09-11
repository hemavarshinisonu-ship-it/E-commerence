import React, { useState, useEffect } from 'react';
import * as productApi from '../api/products';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import { Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');

  const { language } = useAuth();
  const t = useTranslation(language);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getProducts({
        category: selectedCategory,
        search: searchQuery,
        sort: sortOption !== 'default' ? sortOption : undefined
      });
      setProducts(data || []);
    } catch (err) {
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, sortOption]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-banner">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '4px 12px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
          <Sparkles size={14} />
          <span>{t('heroBadge')}</span>
        </div>
        <h1 className="hero-title">{t('heroTitle')}</h1>
        <p className="hero-subtitle">{t('heroSubtitle')}</p>

        {/* Feature Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Truck size={16} color="var(--accent-primary)" />
            <span>{t('freeShippingBadge')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} color="var(--accent-primary)" />
            <span>{t('warrantyBadge')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RefreshCw size={16} color="var(--accent-primary)" />
            <span>{t('returnsBadge')}</span>
          </div>
        </div>
      </section>

      {/* Filter and Sorting Controls */}
      <FilterBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {/* Product Grid / Skeleton / Empty State */}
      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          type="search"
          title="No Products Match Your Filter"
          subtitle={`No products found for "${searchQuery || selectedCategory}". Try searching for something else or clear filters.`}
          actionText="Reset All Filters"
          onAction={() => {
            setSelectedCategory('');
            setSearchQuery('');
            setSortOption('default');
          }}
        />
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
