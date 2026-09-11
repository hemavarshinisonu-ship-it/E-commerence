import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import { Search, X, SlidersHorizontal } from 'lucide-react';

const CATEGORY_KEYS = [
  { key: 'catAll', value: '' },
  { key: 'catTech', value: 'Smartphones & Tech' },
  { key: 'catLaptops', value: 'Laptops & Computers' },
  { key: 'catFashion', value: 'Fashion & Apparel' },
  { key: 'catBeauty', value: 'Beauty & Personal Care' },
  { key: 'catSports', value: 'Sports & Fitness' },
  { key: 'catFood', value: 'Food & Healthcare' },
  { key: 'catToys', value: 'Toys & Games' },
  { key: 'catHome', value: 'Home & Living' }
];

const FilterBar = ({ selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, sortOption, setSortOption }) => {
  const { language } = useAuth();
  const t = useTranslation(language);

  return (
    <div className="filter-container">
      {/* Category Pills */}
      <div className="category-pills">
        {CATEGORY_KEYS.map((item) => (
          <button
            key={item.key}
            onClick={() => setSelectedCategory(item.value)}
            className={`pill-btn ${(!selectedCategory && item.value === '') || selectedCategory === item.value ? 'active' : ''}`}
          >
            {t(item.key)}
          </button>
        ))}
      </div>

      {/* Search & Sort Actions */}
      <div className="filter-actions">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="clear-search-btn">
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <SlidersHorizontal size={16} color="var(--text-muted)" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="default">{t('sortBy')}: Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
