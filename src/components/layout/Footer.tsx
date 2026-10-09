'use client';

import Link from 'next/link';
import { PHONE_1, PHONE_2, WHATSAPP_NUMBER, FACEBOOK, INSTAGRAM } from '@/lib/utils';

export default function Footer() {
  const year = 2026;

  return (
    <footer style={{background:'linear-gradient(160deg,#0d3317 0%,#1a5c2a 100%)', color:'#fff', paddingTop:'4rem', paddingBottom:'2rem', marginTop:'auto'}}>
      <div className="container">
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'3rem', marginBottom:'3rem'}}>
          {/* Brand */}
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1rem'}}>
              <span style={{fontSize:'2rem'}}>🐇</span>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:'1.75rem',fontWeight:800,letterSpacing:'0.05em'}}>
                RABBIT<span style={{color:'var(--brand-gold)'}}>RY</span>
              </span>
            </div>
            <p style={{color:'rgba(255,255,255,0.7)',fontSize:'0.9rem',lineHeight:1.7,maxWidth:260,marginBottom:'1.25rem'}}>
              Full-cycle commercial rabbit farm by Danethicals Limited. Based in Ile-Ife, Osun State, Nigeria. Nationwide delivery available.
            </p>
            {/* Socials */}
            <div style={{display:'flex',gap:'0.75rem'}}>
              <a href={`https://facebook.com/${FACEBOOK}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                style={{width:38,height:38,background:'rgba(255,255,255,0.12)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s',color:'#fff',fontSize:'1rem'}}
                className="social-btn">
                f
              </a>
              <a href={`https://twitter.com/${INSTAGRAM}`} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X"
                style={{width:38,height:38,background:'rgba(255,255,255,0.12)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s',color:'#fff',fontSize:'1rem'}}
                className="social-btn">
                𝕏
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                style={{width:38,height:38,background:'rgba(37,211,102,0.25)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s',color:'#fff',fontSize:'1.1rem'}}
                className="social-btn">
                ✆
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:'1rem',fontWeight:700,marginBottom:'1.25rem',color:'rgba(255,255,255,0.9)'}}>Quick Links</h4>
            <ul style={{display:'flex',flexDirection:'column',gap:'0.6rem'}}>
              {[
                { href:'/shop?cat=live-stock', label:'Live Breeding Stock' },
                { href:'/shop?cat=processed-meat', label:'Processed Rabbit Meat' },
                { href:'/shop?cat=catering', label:'Event Catering' },
                { href:'/shop?cat=by-products', label:'Organic Farm Inputs' },
                { href:'/shop?cat=equipment', label:'Cages & Equipment' },
                { href:'/estimator', label:'Farm Estimator Tool' },
                { href:'/guide', label:'Free Farming Guide (PDF)' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} style={{color:'rgba(255,255,255,0.65)',fontSize:'0.875rem',transition:'color 0.2s'}}
                    onMouseEnter={e => (e.currentTarget.style.color='#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.65)')}>
                    → {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:'1rem',fontWeight:700,marginBottom:'1.25rem',color:'rgba(255,255,255,0.9)'}}>Contact Us</h4>
            <div style={{display:'flex',flexDirection:'column',gap:'0.875rem'}}>
              <div>
                <p style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.45)',marginBottom:'0.15rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>Phone</p>
                <a href={`tel:${PHONE_1}`} style={{color:'rgba(255,255,255,0.85)',fontSize:'0.9rem',fontWeight:600}}>{PHONE_1}</a>
                <span style={{color:'rgba(255,255,255,0.4)', margin:'0 0.4rem'}}>/</span>
                <a href={`tel:${PHONE_2}`} style={{color:'rgba(255,255,255,0.85)',fontSize:'0.9rem',fontWeight:600}}>{PHONE_2}</a>
              </div>
              <div>
                <p style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.45)',marginBottom:'0.15rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>Location</p>
                <p style={{color:'rgba(255,255,255,0.75)',fontSize:'0.875rem',lineHeight:1.5}}>
                  Parakin-Obalufe Area,<br/>Ile-Ife, Osun State, Nigeria
                </p>
              </div>
              <div>
                <p style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.45)',marginBottom:'0.15rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>Social</p>
                <p style={{color:'rgba(255,255,255,0.75)',fontSize:'0.875rem'}}>@Rabbitryrabbit</p>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <div style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'var(--radius-lg)',padding:'1.5rem',textAlign:'center'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>💬</div>
              <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:'1rem',fontWeight:700,marginBottom:'0.5rem',color:'#fff'}}>
                Order on WhatsApp
              </h4>
              <p style={{color:'rgba(255,255,255,0.65)',fontSize:'0.8rem',marginBottom:'1rem',lineHeight:1.5}}>
                Fastest way to order! Chat with us directly.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello RABBITRY 🐇, I would like to make an enquiry.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
                style={{width:'100%',justifyContent:'center'}}
              >
                Open WhatsApp →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{borderTop:'1px solid rgba(255,255,255,0.12)',paddingTop:'1.5rem',display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'1rem'}}>
          <p style={{color:'rgba(255,255,255,0.45)',fontSize:'0.8rem'}}>
            © {year} Danethicals Limited — RABBITRY. All rights reserved.
          </p>
          <div style={{display:'flex',gap:'1.5rem'}}>
            {[
              {href:'/privacy',label:'Privacy Policy'},
              {href:'/terms',label:'Terms'},
              {href:'/admin',label:'Admin'},
            ].map(l => (
              <Link key={l.href} href={l.href} style={{color:'rgba(255,255,255,0.4)',fontSize:'0.78rem',transition:'color 0.2s'}}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
