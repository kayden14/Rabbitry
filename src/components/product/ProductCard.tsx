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

function getCategoryBadge(cat: string) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    'live-stock': { label: 'Live Stock', bg: '#ecfdf5', color: '#065f46' },
    'processed-meat': { label: 'Culinary Meat', bg: '#fef2f2', color: '#991b1b' },
    'catering': { label: 'Event Catering', bg: '#fffbeb', color: '#92400e' },
    'by-products': { label: 'Organic Input', bg: '#f0fdf4', color: '#166534' },
    'equipment': { label: 'Fabrication', bg: '#f0f9ff', color: '#075985' },
  };
  return map[cat] || { label: cat, bg: '#f8fafc', color: '#334155' };
}

export default function ProductCard({ product, delay = 0 }: Props) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const isOutOfStock = product.stockStatus === 'out-of-stock';
  const badge = getCategoryBadge(product.category);

  const waText = encodeURIComponent(
    `Hello RABBITRY Danethicals,\n\nI want to order: *${product.name}*\nPrice: ${formatNaira(product.price)}\nStock Status: ${product.stockStatus}\n\nPlease confirm availability and dispatch fee to my state.`
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const imageSrc = product.images?.[0] || '/images/white-rabbit.jpg';

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        animationDelay: `${delay}s`,
      }}
      className="card-hover-lift"
    >
      {/* Product Image Container */}
      <Link href={`/shop/${product.slug}`} style={{ textDecoration: 'none', position: 'relative', display: 'block' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '210px',
            backgroundColor: '#f1f5f9',
            overflow: 'hidden',
          }}
        >
          {/* Real Photo */}
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.35s ease',
            }}
            className="product-image-zoom"
          />

          {/* Badges Overlay */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
              zIndex: 2,
            }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                padding: '3px 8px',
                borderRadius: '4px',
                background: badge.bg,
                color: badge.color,
                border: `1px solid ${badge.color}25`,
              }}
            >
              {badge.label}
            </span>

            {product.featured && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: '#0f431f',
                  color: '#ffffff',
                }}
              >
                Featured
              </span>
            )}
          </div>

          {/* Secondary Attribute Tag */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '10px',
              zIndex: 2,
            }}
          >
            {product.category === 'live-stock' && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  color: '#ffffff',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {(product as LiveStockProduct).weightKg} kg · {(product as LiveStockProduct).ageMonths} mo
              </span>
            )}
            {product.category === 'processed-meat' && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  color: '#ffffff',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {(product as ProcessedMeatProduct).storageState === 'fresh' ? 'Freshly Dressed' : 'Frozen Pack'}
              </span>
            )}
            {product.category === 'equipment' && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  color: '#ffffff',
                  backdropFilter: 'blur(4px)',
                }}
              >
                Heavy Galvanized
              </span>
            )}
          </div>

          {isOutOfStock && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3,
              }}
            >
              <span
                style={{
                  background: '#b91c1c',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content Details */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Link href={`/shop/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontSize: '0.98rem',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.35,
              marginBottom: '6px',
            }}
          >
            {product.name}
          </h3>
        </Link>

        <p
          style={{
            fontSize: '0.8rem',
            color: '#64748b',
            lineHeight: 1.5,
            marginBottom: '12px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </p>

        {/* Price & Action Row */}
        <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f431f' }}>
                {formatNaira(product.price)}
              </span>
              {product.category === 'processed-meat' && (
                <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: '4px' }}>
                  ({formatNaira((product as ProcessedMeatProduct).pricePerKg)}/kg)
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: '0.7rem',
                color: '#166534',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
              Ready for dispatch
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                background: added ? '#15803d' : isOutOfStock ? '#cbd5e1' : '#0f431f',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '9px 12px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              {added ? 'Added to Cart ✓' : 'Add to Cart'}
            </button>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Order ${product.name} on WhatsApp`}
              style={{
                background: '#25d366',
                color: '#ffffff',
                borderRadius: '6px',
                padding: '9px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
