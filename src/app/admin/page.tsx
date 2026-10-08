'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatNaira } from '@/lib/utils';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryState: string;
  deliveryCity: string;
  items: { productName: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  deliveryFee: number | null;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#fef3c7',
  'payment-proof-uploaded': '#dbeafe',
  confirmed: '#d1fae5',
  processing: '#ede9fe',
  dispatched: '#fce7f3',
  delivered: '#dcfce7',
  cancelled: '#fee2e2',
};

const STATUS_TEXT: Record<string, string> = {
  pending: '#92400e',
  'payment-proof-uploaded': '#1e40af',
  confirmed: '#065f46',
  processing: '#5b21b6',
  dispatched: '#9d174d',
  delivered: '#14532d',
  cancelled: '#991b1b',
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<'orders' | 'leads' | 'products'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deliveryFee, setDeliveryFee] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [ordersRes, leadsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/leads'),
        ]);
        setOrders(await ordersRes.json());
        setLeads(await leadsRes.json());
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingOrder.id,
          deliveryFee: deliveryFee ? parseFloat(deliveryFee) : editingOrder.deliveryFee,
          status: newStatus || editingOrder.status,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === updated.order.id ? updated.order : o));
        setEditingOrder(null);
      }
    } catch {
      //
    }
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.subtotal, 0),
    totalLeads: leads.length,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)', fontFamily: 'Outfit, sans-serif' }}>
      {/* Sidebar + Content */}
      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{
          width: 240, minHeight: '100vh',
          background: 'linear-gradient(180deg,#0d3317 0%,#1a5c2a 100%)',
          padding: '2rem 1.25rem',
          position: 'sticky', top: 0,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🐇</div>
            <div style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}>
              RABBITRY
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Panel</div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
            {([
              { id: 'orders', icon: '📦', label: 'Orders' },
              { id: 'leads', icon: '📋', label: 'Leads & Inquiries' },
              { id: 'products', icon: '🐇', label: 'Products' },
            ] as { id: typeof tab; icon: string; label: string }[]).map(item => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem', borderRadius: 'var(--radius)',
                  background: tab === item.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: tab === item.id ? '#fff' : 'rgba(255,255,255,0.55)',
                  border: 'none', cursor: 'pointer', fontSize: '0.875rem',
                  fontWeight: tab === item.id ? 700 : 400,
                  transition: 'all 0.2s', textAlign: 'left',
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>

          <Link
            href="/"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem',
              marginTop: 'auto', padding: '0.75rem',
            }}
          >
            ← Back to Website
          </Link>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: '2.5rem' }}>
          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
              {tab === 'orders' ? 'Order Management' : tab === 'leads' ? 'Leads & Inquiries' : 'Products'}
            </h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
              Manage your RABBITRY operations from one place.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: '#1a5c2a' },
              { label: 'Pending', value: stats.pendingOrders, icon: '⏳', color: '#c9921a' },
              { label: 'Delivered', value: stats.delivered, icon: '✅', color: '#16a34a' },
              { label: 'Revenue (Subtotals)', value: formatNaira(stats.totalRevenue), icon: '💰', color: '#2563eb' },
              { label: 'Leads', value: stats.totalLeads, icon: '👤', color: '#7c3aed' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: '#fff',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow)',
                borderTop: `3px solid ${stat.color}`,
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Orders Tab */}
          {tab === 'orders' && (
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray-400)' }}>Loading orders...</div>
              ) : orders.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '4rem', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", color: 'var(--gray-700)' }}>No orders yet</h3>
                  <p style={{ color: 'var(--gray-400)', marginTop: '0.5rem' }}>Orders will appear here once customers place them.</p>
                </div>
              ) : (
                <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'var(--gray-50)', borderBottom: '2px solid var(--gray-200)' }}>
                          {['Order #', 'Customer', 'Items', 'Location', 'Subtotal', 'Delivery Fee', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                            <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                            <td style={{ padding: '0.875rem 1rem' }}>
                              <span style={{ fontWeight: 700, color: 'var(--brand-green)', fontSize: '0.82rem' }}>{order.orderNumber}</span>
                            </td>
                            <td style={{ padding: '0.875rem 1rem' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{order.customerName}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{order.customerPhone}</div>
                            </td>
                            <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--gray-700)', maxWidth: 200 }}>
                              {order.items.map((i, idx) => (
                                <div key={idx}>{i.productName} × {i.quantity}</div>
                              ))}
                            </td>
                            <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: 'var(--gray-600)' }}>
                              {order.deliveryCity}, {order.deliveryState}
                            </td>
                            <td style={{ padding: '0.875rem 1rem', fontWeight: 700, fontSize: '0.85rem' }}>
                              {formatNaira(order.subtotal)}
                            </td>
                            <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem' }}>
                              {order.deliveryFee != null ? (
                                <span style={{ color: 'var(--brand-green)', fontWeight: 700 }}>{formatNaira(order.deliveryFee)}</span>
                              ) : (
                                <span style={{ color: 'var(--brand-gold)', fontSize: '0.78rem', fontWeight: 600 }}>Not set</span>
                              )}
                            </td>
                            <td style={{ padding: '0.875rem 1rem', fontSize: '0.78rem', color: 'var(--gray-600)' }}>
                              {order.paymentMethod}
                            </td>
                            <td style={{ padding: '0.875rem 1rem' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '999px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                background: STATUS_COLORS[order.status] || '#f3f4f6',
                                color: STATUS_TEXT[order.status] || '#374151',
                                whiteSpace: 'nowrap',
                              }}>
                                {order.status}
                              </span>
                            </td>
                            <td style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
                              {new Date(order.createdAt).toLocaleDateString('en-NG')}
                            </td>
                            <td style={{ padding: '0.875rem 1rem' }}>
                              <button
                                onClick={() => { setEditingOrder(order); setDeliveryFee(order.deliveryFee?.toString() || ''); setNewStatus(order.status); }}
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Leads Tab */}
          {tab === 'leads' && (
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray-400)' }}>Loading leads...</div>
              ) : leads.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '4rem', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", color: 'var(--gray-700)' }}>No leads yet</h3>
                  <p style={{ color: 'var(--gray-400)', marginTop: '0.5rem' }}>Leads captured via lead magnet and contact forms appear here.</p>
                </div>
              ) : (
                <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--gray-50)', borderBottom: '2px solid var(--gray-200)' }}>
                        {['Name', 'Phone', 'Email', 'Source', 'Date', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map(lead => (
                        <tr key={lead.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                          <td style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.875rem' }}>{lead.name}</td>
                          <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem' }}>{lead.phone}</td>
                          <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>{lead.email || '—'}</td>
                          <td style={{ padding: '0.875rem 1rem' }}>
                            <span style={{ background: 'var(--brand-cream)', color: 'var(--brand-green)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600 }}>
                              {lead.source}
                            </span>
                          </td>
                          <td style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                            {new Date(lead.createdAt).toLocaleDateString('en-NG')}
                          </td>
                          <td style={{ padding: '0.875rem 1rem' }}>
                            <a
                              href={`https://wa.me/${lead.phone.replace(/^0/, '234')}?text=${encodeURIComponent('Hello ' + lead.name + ', this is RABBITRY. Thank you for your interest in our rabbit farming guide! We\'d love to share updates with you.')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-whatsapp btn-sm"
                              style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}
                            >
                              WhatsApp
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Products Tab */}
          {tab === 'products' && (
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow)' }}>
              <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
                Products are currently managed via the data file. Full CRUD editor coming in Phase 2.
              </p>
              <Link href="/shop" target="_blank" className="btn btn-primary">
                View Shop →
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
          onClick={e => e.target === e.currentTarget && setEditingOrder(null)}
        >
          <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: 440 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              Update Order: {editingOrder.orderNumber}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Delivery Fee (₦)</label>
                <input
                  type="number"
                  className="form-input"
                  value={deliveryFee}
                  onChange={e => setDeliveryFee(e.target.value)}
                  placeholder="e.g. 5000"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Order Status</label>
                <select className="form-input form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {['pending', 'payment-proof-uploaded', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button onClick={handleUpdateOrder} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Save Changes
                </button>
                <button onClick={() => setEditingOrder(null)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
