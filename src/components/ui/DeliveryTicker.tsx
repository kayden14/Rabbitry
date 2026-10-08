const DELIVERIES = [
  { emoji: '📦', text: 'Order dispatched to Lagos — 4 NZW does in a well-ventilated crate via ABC Transport.' },
  { emoji: '🚛', text: 'Fresh rabbit meat delivered to Abuja customer — 6kg frozen pack, same-day collection.' },
  { emoji: '🐇', text: 'Flemish Brown breeding pair shipped to Enugu — safely packaged and vaccinated.' },
  { emoji: '🌿', text: 'Bulk order: 50L bottled rabbit urine dispatched to organic farm in Ogun State.' },
  { emoji: '🏗️', text: '10-unit battery cage set delivered and installed in Ibadan commercial farm.' },
  { emoji: '🍖', text: 'Event catering completed in Ile-Ife — 30 plates of golden roasted rabbit for graduation dinner.' },
  { emoji: '📦', text: 'Dutch rabbit pair delivered to Port Harcourt family — health certificate included.' },
  { emoji: '🥩', text: 'Restaurant order: 20kg fresh dressed rabbit delivered to Benin City via cold chain.' },
  { emoji: '🐇', text: 'Holland Lop pet pair dispatched to Kano — airvents cage, feeding instructions provided.' },
  { emoji: '🌿', text: '100kg dried rabbit manure dispatched to Kaduna farm in 10kg bags.' },
];

export default function DeliveryTicker() {
  const doubled = [...DELIVERIES, ...DELIVERIES];

  return (
    <div style={{
      background: 'var(--brand-green-dark)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      padding: '0.875rem 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Gradient edges */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 80,
        background: 'linear-gradient(to right, var(--brand-green-dark), transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 80,
        background: 'linear-gradient(to left, var(--brand-green-dark), transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      <div className="marquee-track">
        <div className="marquee-inner">
          {doubled.map((d, i) => (
            <span key={i} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginRight: '3rem',
              fontSize: '0.82rem',
              color: 'rgba(255,255,255,0.8)',
              whiteSpace: 'nowrap',
            }}>
              <span style={{
                background: 'rgba(201,146,26,0.25)',
                border: '1px solid rgba(201,146,26,0.4)',
                borderRadius: 'var(--radius-full)',
                padding: '0.1rem 0.5rem',
                color: 'var(--brand-gold-light)',
                fontSize: '0.7rem',
                fontWeight: 600,
              }}>
                LIVE UPDATE
              </span>
              {d.emoji} {d.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
