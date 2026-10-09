'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { allProducts } from '@/data/products';
import { ProductCategory } from '@/types';
import { formatCategoryLabel } from '@/lib/utils';

const CATEGORIES: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'live-stock', label: 'Live Stock & Pets' },
  { id: 'processed-meat', label: 'Processed Rabbit Meat' },
  { id: 'catering', label: 'Event Catering' },
  { id: 'by-products', label: 'Organic Farm Inputs' },
  { id: 'equipment', label: 'Equipment & Cages' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat') as ProductCategory | null;
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>(catParam || 'all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock'>('all');

  const filtered = useMemo(() => {
    let items = allProducts;

    if (activeCategory !== 'all') {
      items = items.filter(p => p.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (stockFilter === 'in-stock') {
      items = items.filter(p => p.stockStatus === 'in-stock');
    }

    if (sortBy === 'price-asc') items = [...items].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') items = [...items].sort((a, b) => b.price - a.price);
    if (sortBy === 'featured') items = [...items].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return items;
  }, [activeCategory, search, sortBy, stockFilter]);

  return (
    <>
      <Navbar />
      <main>
        {/* Page header */}
        <div style={{
          background: 'linear-gradient(135deg,#0d3317,#1a5c2a)',
          padding: '5rem 0 3.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(201,146,26,0.15)', border: '1px solid rgba(201,146,26,0.3)',
                borderRadius: '999px', padding: '0.3rem 1rem', marginBottom: '1rem',
                color: 'var(--brand-gold-light)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                🐇 Fresh Stock Updated Weekly
              </span>
              <h1 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#fff',
                marginBottom: '0.75rem', lineHeight: 1.15,
              }}>
                Our Complete Product Range
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', maxWidth: 520, margin: '0 auto' }}>
                Browse {allProducts.length} products across 5 categories — live animals, processed meat, catering, farm inputs & equipment.
              </p>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '3rem 1.25rem' }}>
          {/* Category pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginBottom: '2rem' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '0.875rem', marginBottom: '2rem',
            alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ flex: 1, minWidth: 220, maxWidth: 400 }}>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--gray-400)', fontSize: '1rem',
                }}>🔍</span>
                <input
                  type="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="form-input form-select"
                style={{ width: 'auto', minWidth: 160 }}
              >
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="featured">Featured First</option>
              </select>
              <select
                value={stockFilter}
                onChange={e => setStockFilter(e.target.value as 'all' | 'in-stock')}
                className="form-input form-select"
                style={{ width: 'auto', minWidth: 140 }}
              >
                <option value="all">All Stock</option>
                <option value="in-stock">In Stock Only</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '1.5rem', fontWeight: 500 }}>
            Showing <strong style={{ color: 'var(--brand-green)' }}>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'all' && ` in ${formatCategoryLabel(activeCategory)}`}
          </p>

          {/* Products grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐇</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.35rem', color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                No products found
              </h3>
              <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>Try adjusting your search or filters.</p>
              <button
                onClick={() => { setSearch(''); setActiveCategory('all'); setStockFilter('all'); }}
                className="btn btn-outline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: '1.5rem' }}>
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} delay={Math.min(i * 0.05, 0.3)} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-cream)' }}>
          <p style={{ color: 'var(--brand-green-dark)', fontWeight: 600 }}>Loading product catalog...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
