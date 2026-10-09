import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PHONE_1, WHATSAPP_NUMBER } from '@/lib/utils';

export const metadata = {
  title: 'Free Rabbit Farming Guide Nigeria (PDF) | Danethicals Rabbitry',
  description:
    'Download the complete guide to commercial and small-scale rabbit farming in Nigeria. Breeds, battery cages, feeding, veterinary calendar and startup economics.',
};

export default function GuidePage() {
  return (
    <>
      <Navbar />
      <main style={{ background: '#f8fafc', padding: '3.5rem 0 5rem' }}>
        <div className="container" style={{ maxWidth: 880 }}>
          {/* Header Card */}
          <div
            style={{
              background: 'linear-gradient(145deg, #082e11 0%, #145220 100%)',
              borderRadius: '20px',
              padding: '3rem 2.5rem',
              color: '#ffffff',
              marginBottom: '2.5rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 24px 48px rgba(8,46,17,0.22)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(246,199,61,0.20)',
                border: '1px solid rgba(246,199,61,0.48)',
                borderRadius: '30px',
                padding: '6px 16px',
                marginBottom: '1.25rem',
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f6c73d', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                📘 Official Agribusiness Publication
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.8rem, 4vw, 2.7rem)',
                fontWeight: 900,
                lineHeight: 1.2,
                marginBottom: '1rem',
              }}
            >
              Commercial &amp; Small-Scale Rabbit Farming in Nigeria
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 640 }}>
              The practical, step-by-step master handbook on breeds, battery caging, feeding, disease prevention, and high-yield commercial agribusiness in Nigeria.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a
                href="/api/guide/download"
                download="Danethicals-Rabbit-Farming-Guide-Nigeria.pdf"
                style={{
                  background: 'linear-gradient(135deg, #c98a12 0%, #e8a830 100%)',
                  color: '#0a1f0d',
                  fontWeight: 800,
                  fontSize: '1rem',
                  padding: '14px 28px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 22px rgba(201,138,18,0.50)',
                }}
              >
                📥 Download Free PDF Handbook
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  'Hello Danethicals Rabbitry! I am reading your Rabbit Farming Guide and would like to inquire about breeding stock and cages.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#25d366',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  padding: '14px 24px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                💬 WhatsApp Consultation
              </a>
            </div>
          </div>

          {/* Inline PDF Viewer */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 25px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(90deg, #082e11, #145220)',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>📄</span>
                <span style={{ color: '#f6c73d', fontWeight: 700, fontSize: '0.9rem' }}>
                  Danethicals Rabbit Farming Guide — PDF Preview
                </span>
              </div>
              <a
                href="/api/guide/download"
                download="Danethicals-Rabbit-Farming-Guide-Nigeria.pdf"
                style={{
                  background: 'linear-gradient(135deg, #c98a12 0%, #e8a830 100%)',
                  color: '#0a1f0d',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                📥 Download PDF
              </a>
            </div>
            <iframe
              src="/guides/Danethicals-Rabbit-Farming-Guide-Nigeria.pdf"
              title="Danethicals Rabbit Farming Guide PDF"
              width="100%"
              style={{ height: '600px', border: 'none', display: 'block' }}
            />
          </div>

          {/* Handbook Content Document */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 4vw, 3.5rem)',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 25px rgba(0,0,0,0.04)',
              lineHeight: 1.8,
              color: '#334155',
            }}
          >
            {/* Chapter 1 */}
            <section style={{ marginBottom: '3rem' }}>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.6rem',
                  color: '#082e11',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  borderBottom: '2px solid #e2e8f0',
                  paddingBottom: '0.5rem',
                }}
              >
                1. Why Commercial Rabbit Farming in Nigeria?
              </h2>
              <p>
                Rabbit farming (cuniculture) has emerged as one of the most profitable micro-livestock enterprises in Nigeria. Rapid urbanization, increasing demand for white meat, and minimal space requirements make it ideal for both backyard enthusiasts and large-scale commercial investors.
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.75rem' }}>
                <li><strong>Short Gestation:</strong> Does kindle in just 28–32 days, producing 6–10 kits per litter and 4–6 litters per year.</li>
                <li><strong>High Feed Conversion:</strong> Converts forage and farm greens into nutritious, lean meat faster than traditional livestock.</li>
                <li><strong>Zero-Waste Agribusiness:</strong> Urine is harvested as organic pesticide (₦1,200–₦1,800/L); manure is prized as cold fertilizer (₦3,500/bag); skins are tanned for crafts.</li>
              </ul>
            </section>

            {/* Chapter 2 */}
            <section style={{ marginBottom: '3rem' }}>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.6rem',
                  color: '#082e11',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  borderBottom: '2px solid #e2e8f0',
                  paddingBottom: '0.5rem',
                }}
              >
                2. Top Foundation Breeds for Nigerian Climate
              </h2>
              <p>
                Foundation genetics determine your farm success. Starting with certified pure or high-grade hybrid breeding stock ensures fast kit weight gain and high survival.
              </p>
              <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#082e11', color: '#ffffff' }}>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Breed</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Weight</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Primary Purpose</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left' }}>Climate Adaptability</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>New Zealand White</td>
                      <td style={{ padding: '10px 14px' }}>4.5 – 5.5 kg</td>
                      <td style={{ padding: '10px 14px' }}>Fast-growing commercial meat</td>
                      <td style={{ padding: '10px 14px' }}>Outstanding heat tolerance</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>Chinchilla Giganta</td>
                      <td style={{ padding: '10px 14px' }}>4.0 – 5.2 kg</td>
                      <td style={{ padding: '10px 14px' }}>Dual: Meat &amp; dense pelt</td>
                      <td style={{ padding: '10px 14px' }}>Hardy &amp; high maternal instincts</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>Dutch Rabbit</td>
                      <td style={{ padding: '10px 14px' }}>2.0 – 2.8 kg</td>
                      <td style={{ padding: '10px 14px' }}>Pets &amp; starter backyard kits</td>
                      <td style={{ padding: '10px 14px' }}>Gentle, low feed footprint</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>Flemish Giant</td>
                      <td style={{ padding: '10px 14px' }}>6.0 – 8.5 kg</td>
                      <td style={{ padding: '10px 14px' }}>Grand breeding buck &amp; show</td>
                      <td style={{ padding: '10px 14px' }}>Needs extra space &amp; ventilation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Chapter 3 */}
            <section style={{ marginBottom: '3rem' }}>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.6rem',
                  color: '#082e11',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  borderBottom: '2px solid #e2e8f0',
                  paddingBottom: '0.5rem',
                }}
              >
                3. Housing, Battery Cages &amp; Automated Drinkers
              </h2>
              <p>
                Proper housing protects animals from rain, excessive heat, and predators like rats or snakes.
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.75rem' }}>
                <li><strong>Wire Mesh:</strong> Use 16-gauge galvanized mesh. Floor mesh must have 0.5 x 1.0 inch spacing to allow feces to drop without causing sore hocks.</li>
                <li><strong>Slanting Waste Trays:</strong> Metal or PVC trays under each cage tier channel urine into collection drums and drop pellets onto drying trays.</li>
                <li><strong>Automated Nipple Drinkers:</strong> Avoid open water clay cups which spread bacteria. Connect brass 360° automatic nipples to an overhead tank.</li>
                <li><strong>Kindling Nest Boxes:</strong> Install wooden or galvanized nesting boxes with dry shavings 3 days before expected delivery.</li>
              </ul>
            </section>

            {/* Chapter 4 */}
            <section style={{ marginBottom: '3rem' }}>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.6rem',
                  color: '#082e11',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  borderBottom: '2px solid #e2e8f0',
                  paddingBottom: '0.5rem',
                }}
              >
                4. Daily Feeding &amp; Nutrition Guidelines
              </h2>
              <p>
                Rabbits are monogastric herbivores. A combination of commercial pellets (60–70%) and dried wilted grasses/hay (30%) yields optimal digestion and weight gain.
              </p>
              <p>
                <strong>Recommended Local Forages:</strong> Guinea grass, Sweet potato vines, Centrosema, Stylosanthes, Moringa leaves (air-dried for 12 hours before feeding).
              </p>
            </section>

            {/* Chapter 5 */}
            <section style={{ marginBottom: '3rem' }}>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.6rem',
                  color: '#082e11',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  borderBottom: '2px solid #e2e8f0',
                  paddingBottom: '0.5rem',
                }}
              >
                5. Startup Economics: Sample 10-Doe Foundation Setup
              </h2>
              <p>
                A foundation breeding unit consisting of 10 mature breeding does and 2 unrelated bucks produces 250–350 market-ready rabbits per year.
              </p>
              <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '1.5rem', marginTop: '1rem' }}>
                <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>
                  💰 Estimated First-Year Turnover: ₦1,400,000 – ₦2,200,000
                </p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.88rem', color: '#64748b' }}>
                  Includes sale of breeding pairs, dressed rabbit meat, organic fertilizer manure, and natural foliar urine spray.
                </p>
              </div>
            </section>

            {/* Bottom Download & Contact */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
              }}
            >
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem', color: '#082e11', marginBottom: '0.5rem' }}>
                Ready to Order Breeding Stock or Battery Cages?
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Danethicals Limited supplies certified rabbits, customized battery cages, organic fertilizers, and dressed meat with nationwide delivery.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="/api/guide/download"
                  download="Danethicals-Rabbit-Farming-Guide-Nigeria.pdf"
                  className="btn btn-primary"
                  style={{ background: '#082e11', color: '#ffffff' }}
                >
                  📥 Download PDF Handbook
                </a>
                <Link href="/shop" className="btn btn-outline">
                  Browse Catalog
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  WhatsApp Farm Desk
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
