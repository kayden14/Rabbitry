'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product, LiveStockProduct, ProcessedMeatProduct, CateringProduct, ByProductItem, EquipmentProduct } from '@/types';
import { useCartStore } from '@/lib/cart-store';
import { formatNaira, WHATSAPP_NUMBER } from '@/lib/utils';

interface Props {
  product: Product;
  delay?: number;
}

function getCategoryBadgeColor(cat: string) {
  const map: Record<string, string> = {
    'live-stock': '#dcfce7',
    'processed-meat': '#fee2e2',
    'catering': '#fef3c7',
    'by-products': '#d1fae5',
    'equipment': '#dbeafe',
  };
  return map[cat] || '#f3f4f6';
}

function getCategoryBadgeText(cat: string) {
  const map: Record<string, string> = {
    'live-stock': '🐇 Live Stock',
    'processed-meat': '🥩 Processed Meat',
    'catering': '🍖 Catering',
    'by-products': '🌿 Farm Input',
    'equipment': '🏗️ Equipment',
  };
  return map[cat] || cat;
}

function getSubtitleInfo(product: Product): string {
  switch (product.category) {
    case 'live-stock': {
      const p = product as LiveStockProduct;
      return `${p.breed} · ${p.ageMonths}mo · ${p.weightKg}kg`;
    }
    case 'processed-meat': {
      const p = product as ProcessedMeatProduct;
      return `${p.storageState === 'fresh' ? '🟢 Fresh' : '🧊 Frozen'} · ${p.weightKg}kg · ${formatNaira(p.pricePerKg)}/kg`;
    }
    case 'catering': {
      const p = product as CateringProduct;
      return `Serves: ${p.servingSize} · ${p.leadTimeDays}d lead time`;
    }
    case 'by-products': {
      const p = product as ByProductItem;
      return p.volumeLiters ? `${p.volumeLiters}L bottle` : `${p.weightKg}kg bag`;
    }
    case 'equipment': {
      const p = product as EquipmentProduct;
      return p.dimensionsLWH || p.materialSpec || '';
    }
    default:
      return '';
  }
}

export default function ProductCard({ product, delay = 0 }: Props) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const waMsg = encodeURIComponent(
    `Hello RABBITRY 🐇, I'm interested in:\n\n*${product.name}*\nPrice: ${formatNaira(product.price)}\n\nPlease advise on availability and delivery to my location.`
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isOutOfStock = product.stockStatus === 'out-of-stock';
  const subtitle = getSubtitleInfo(product);
  const badgeBg = getCategoryBadgeColor(product.category);

  return (
    <div
      className="card animate-fade-up"
      style={{
        animationDelay: `${delay}s`,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        opacity: isOutOfStock ? 0.75 : 1,
      }}
    >
      {/* Image */}
      <Link href={`/shop/${product.slug}`} style={{ textDecoration: 'none' }}>
        <div className="product-img-wrap">
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1a5c2a22, #c9921a22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '5rem',
          }}>
            {product.category === 'live-stock' && '🐇'}
            {product.category === 'processed-meat' && '🥩'}
            {product.category === 'catering' && '🍖'}
            {product.category === 'by-products' && '🌿'}
            {product.category === 'equipment' && '🏗️'}
          </div>
          {/* Status badges */}
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{
              background: badgeBg,
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              color: '#374151',
            }}>
              {getCategoryBadgeText(product.category)}
            </span>
            {product.featured && (
              <span style={{ background: 'var(--brand-gold)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                ⭐ Featured
              </span>
            )}
          </div>
          {isOutOfStock && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ background: '#dc2626', color: '#fff', fontWeight: 700, padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.8rem' }}>
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Link href={`/shop/${product.slug}`} style={{ textDecoration: 'none', marginBottom: '0.5rem' }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--gray-900)',
            lineHeight: 1.3,
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-green)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-900)')}
          >
            {product.name}
          </h3>
        </Link>

        {subtitle && (
          <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginBottom: '0.5rem', fontWeight: 500 }}>
            {subtitle}
          </p>
        )}

        <p style={{
          fontSize: '0.82rem',
          color: 'var(--gray-600)',
          lineHeight: 1.6,
          marginBottom: '1rem',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.description}
        </p>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--brand-green)',
            }}>
              {formatNaira(product.price)}
            </div>
            {product.category === 'processed-meat' && (
              <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: '0.1rem' }}>
                {formatNaira((product as ProcessedMeatProduct).pricePerKg)}/kg
              </div>
            )}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: isOutOfStock ? '#dc2626' : '#16a34a',
          }}>
            <span style={{
              width: 7, height: 7,
              background: isOutOfStock ? '#dc2626' : '#16a34a',
              borderRadius: '50%',
              display: 'inline-block',
              animation: isOutOfStock ? 'none' : 'pulse 2s infinite',
            }} />
            {isOutOfStock ? 'Out of Stock' : 'In Stock'}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="btn btn-primary"
            style={{
              flex: 1,
              fontSize: '0.82rem',
              padding: '0.6rem 0.875rem',
              opacity: isOutOfStock ? 0.5 : 1,
              transition: 'all 0.3s ease',
              background: added ? 'linear-gradient(135deg,#16a34a,#22c55e)' : undefined,
            }}
          >
            {added ? '✓ Added!' : '🛒 Add to Cart'}
          </button>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-icon"
            title="Order via WhatsApp"
            style={{ width: 40, height: 40, padding: 0, flexShrink: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
