'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getProductBySlug, allProducts } from '@/data/products';
import { useCartStore } from '@/lib/cart-store';
import { formatNaira, WHATSAPP_NUMBER, PHONE_1 } from '@/lib/utils';
import { LiveStockProduct, ProcessedMeatProduct, CateringProduct, ByProductItem, EquipmentProduct } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { useState, Suspense } from 'react';

function SpecRow({ label, value }: { label: string; value: string | number | boolean }) {
  const display = typeof value === 'boolean' ? (value ? '✅ Yes' : '❌ No') : String(value);
  return (
    <tr style={{ borderBottom: '1px solid var(--gray-100)' }}>
      <td style={{ padding: '0.75rem 0', fontWeight: 600, color: 'var(--gray-600)', fontSize: '0.875rem', width: '40%' }}>{label}</td>
      <td style={{ padding: '0.75rem 0', color: 'var(--gray-800)', fontSize: '0.875rem' }}>{display}</td>
    </tr>
  );
}

function ProductSpecs({ product }: { product: ReturnType<typeof getProductBySlug> }) {
  if (!product) return null;

  const rows: { label: string; value: string | number | boolean }[] = [];

  switch (product.category) {
    case 'live-stock': {
      const p = product as LiveStockProduct;
      rows.push(
        { label: 'Breed', value: p.breed },
        { label: 'Age', value: `${p.ageMonths} months` },
        { label: 'Weight', value: `${p.weightKg} kg` },
        { label: 'Sex', value: p.sex.charAt(0).toUpperCase() + p.sex.slice(1) },
        { label: 'Primary Use', value: p.primaryUse.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
        { label: 'Dewormed', value: p.dewormingStatus },
        { label: 'Vaccinated', value: p.vaccinationStatus },
        ...(p.lineageNotes ? [{ label: 'Lineage Notes', value: p.lineageNotes }] : []),
      );
      break;
    }
    case 'processed-meat': {
      const p = product as ProcessedMeatProduct;
      rows.push(
        { label: 'Type', value: p.meatType === 'whole-dressed' ? 'Whole Dressed' : 'Cut Parts' },
        { label: 'Weight', value: `${p.weightKg} kg` },
        { label: 'Storage State', value: p.storageState.charAt(0).toUpperCase() + p.storageState.slice(1) },
        { label: 'Price per kg', value: formatNaira(p.pricePerKg) },
      );
      break;
    }
    case 'catering': {
      const p = product as CateringProduct;
      rows.push(
        { label: 'Serving Size', value: p.servingSize },
        { label: 'Lead Time', value: `${p.leadTimeDays} days` },
        { label: 'Min. Order', value: `${p.minOrderQty} units` },
        { label: 'Event Types', value: p.eventTypes.map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(', ') },
      );
      break;
    }
    case 'by-products': {
      const p = product as ByProductItem;
      if (p.volumeLiters) rows.push({ label: 'Volume', value: `${p.volumeLiters} litres` });
      if (p.weightKg) rows.push({ label: 'Weight', value: `${p.weightKg} kg` });
      rows.push({ label: 'Application Guide', value: p.applicationGuide });
      break;
    }
    case 'equipment': {
      const p = product as EquipmentProduct;
      if (p.dimensionsLWH) rows.push({ label: 'Dimensions (L×W×H)', value: p.dimensionsLWH });
      if (p.rabbitCapacity) rows.push({ label: 'Rabbit Capacity', value: `${p.rabbitCapacity} rabbits` });
      if (p.materialSpec) rows.push({ label: 'Material Specs', value: p.materialSpec });
      break;
    }
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        {rows.map((row, i) => (
          <SpecRow key={i} label={row.label} value={row.value} />
        ))}
      </tbody>
    </table>
  );
}

function ProductDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  if (!product) notFound();

  const related = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const waMsg = encodeURIComponent(
    `Hello RABBITRY 🐇, I want to order:\n\n*${product.name}*\nQty: ${qty}\nPrice: ${formatNaira(product.price * qty)}\n\nPlease confirm availability and delivery fee to my location.\n\nThank you!`
  );

  const handleAddToCart = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="container" style={{ padding: '3rem 1.25rem' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.82rem', color: 'var(--gray-500)' }}>
            <Link href="/" style={{ color: 'var(--brand-green)' }}>Home</Link>
            <span>›</span>
            <Link href="/shop" style={{ color: 'var(--brand-green)' }}>Shop</Link>
            <span>›</span>
            <span>{product.name}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
            {/* Left: Image */}
            <div>
              <div style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                background: 'linear-gradient(135deg,#1a5c2a15,#c9921a15)',
                aspectRatio: '4/3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9rem',
              }}>
                {product.category === 'live-stock' && '🐇'}
                {product.category === 'processed-meat' && '🥩'}
                {product.category === 'catering' && '🍖'}
                {product.category === 'by-products' && '🌿'}
                {product.category === 'equipment' && '🏗️'}
              </div>
              <div style={{
                marginTop: '1rem',
                padding: '1.25rem',
                background: '#fff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--gray-100)',
              }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 500, marginBottom: '0.75rem' }}>🔒 Secure Order Guarantee</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {[
                    '✅ Health-certified animals',
                    '📦 Nationwide delivery available',
                    '💬 WhatsApp support before & after delivery',
                    '🔄 Replacement guarantee for DOA livestock',
                  ].map((item, i) => (
                    <p key={i} style={{ fontSize: '0.8rem', color: 'var(--gray-700)' }}>{item}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{
                  background: product.stockStatus === 'in-stock' ? '#dcfce7' : '#fee2e2',
                  color: product.stockStatus === 'in-stock' ? '#15803d' : '#dc2626',
                  fontSize: '0.75rem', fontWeight: 700,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                }}>
                  {product.stockStatus === 'in-stock' ? '● In Stock' : '● Out of Stock'}
                </span>
              </div>

              <h1 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 'clamp(1.5rem,3vw,2.25rem)',
                fontWeight: 800,
                color: 'var(--gray-900)',
                lineHeight: 1.2,
                marginBottom: '1rem',
              }}>
                {product.name}
              </h1>

              <div style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: '2.25rem',
                fontWeight: 800,
                color: 'var(--brand-green)',
                marginBottom: '1.5rem',
              }}>
                {formatNaira(product.price)}
              </div>

              <p style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '0.95rem' }}>
                {product.description}
              </p>

              {/* Quantity */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: '0.5rem' }}>
                  Quantity
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0', width: 'fit-content' }}>
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{
                      width: 40, height: 40,
                      background: 'var(--gray-100)', border: '2px solid var(--gray-200)',
                      borderRadius: 'var(--radius) 0 0 var(--radius)',
                      fontSize: '1.25rem', fontWeight: 700,
                      color: 'var(--gray-700)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    −
                  </button>
                  <div style={{
                    width: 56, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid var(--gray-200)',
                    borderLeft: 'none', borderRight: 'none',
                    fontWeight: 700, fontSize: '1rem',
                  }}>
                    {qty}
                  </div>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    style={{
                      width: 40, height: 40,
                      background: 'var(--gray-100)', border: '2px solid var(--gray-200)',
                      borderRadius: '0 var(--radius) var(--radius) 0',
                      fontSize: '1.25rem', fontWeight: 700,
                      color: 'var(--gray-700)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    +
                  </button>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: '0.4rem' }}>
                  Total: <strong style={{ color: 'var(--brand-green)' }}>{formatNaira(product.price * qty)}</strong>
                </p>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockStatus === 'out-of-stock'}
                  className="btn btn-primary btn-lg"
                  style={{
                    width: '100%', justifyContent: 'center',
                    background: added ? 'linear-gradient(135deg,#16a34a,#22c55e)' : undefined,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {added ? '✓ Added to Cart!' : `🛒 Add to Cart — ${formatNaira(product.price * qty)}`}
                </button>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Order via WhatsApp Now
                </a>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <a href={`tel:${PHONE_1}`} className="btn btn-outline" style={{ justifyContent: 'center' }}>
                    📞 Call to Order
                  </a>
                  <Link href="/cart" className="btn" style={{ background: 'var(--gray-100)', color: 'var(--gray-700)', justifyContent: 'center', borderRadius: 'var(--radius-full)' }}>
                    🛒 View Cart
                  </Link>
                </div>
              </div>

              {/* Specifications */}
              <div style={{
                background: 'var(--brand-cream)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
              }}>
                <h3 style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: '1rem', fontWeight: 700,
                  color: 'var(--gray-800)', marginBottom: '1rem',
                }}>
                  Product Specifications
                </h3>
                <ProductSpecs product={product} />
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div>
              <div className="divider" />
              <h2 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: '1.5rem', fontWeight: 700,
                color: 'var(--gray-900)', marginBottom: '1.75rem', marginTop: '2rem',
              }}>
                More from This Category
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.5rem' }}>
                {related.map((p, i) => (
                  <ProductCard key={p.id} product={p} delay={i * 0.1} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-cream)' }}>
          <p style={{ color: 'var(--brand-green-dark)', fontWeight: 600 }}>Loading product details...</p>
        </div>
      }
    >
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
