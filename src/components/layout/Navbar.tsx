'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/lib/cart-store';
import { WHATSAPP_NUMBER, PHONE_1 } from '@/lib/utils';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '/shop', label: 'Store Catalog', children: [
    { href: '/shop?cat=live-stock', label: 'Live Breeding Stock & Pets' },
    { href: '/shop?cat=processed-meat', label: 'Processed Rabbit Meat' },
    { href: '/shop?cat=catering', label: 'Culinary & Event Catering' },
    { href: '/shop?cat=by-products', label: 'Organic By-Products & Inputs' },
    { href: '/shop?cat=equipment', label: 'Equipment & Cages' },
  ]},
  { href: '/estimator', label: 'Farm Estimator' },
  { href: '/guide', label: 'Free Guide' },
  { href: '/catering', label: 'Event Catering' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore(s => s.getTotalItems());

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🐇</span>
          <span className={styles.logoText}>
            RABBIT<span className={styles.logoAccent}>RY</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav}>
          {NAV_LINKS.map(link => (
            <div
              key={link.href}
              className={styles.navItem}
              onMouseEnter={() => link.children && setActiveDropdown(link.href)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href={link.href} className={styles.navLink}>
                {link.label}
                {link.children && <span className={styles.chevron}>▾</span>}
              </Link>
              {link.children && activeDropdown === link.href && (
                <div className={styles.dropdown}>
                  {link.children.map(child => (
                    <Link key={child.href} href={child.href} className={styles.dropdownItem}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-whatsapp btn-sm ${styles.waBtn}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="hide-mobile">WhatsApp</span>
          </a>
          <Link href="/cart" className={styles.cartBtn} aria-label="Shopping cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/>
            </svg>
            {mounted && totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems}</span>
            )}
          </Link>
          <button
            className={styles.hamburger}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className={open ? styles.barOpen : ''}></span>
            <span className={open ? styles.barOpen : ''}></span>
            <span className={open ? styles.barOpen : ''}></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${open ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerContent}>
          {NAV_LINKS.map(link => (
            <div key={link.href}>
              <Link href={link.href} className={styles.mobileLink} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
              {link.children && (
                <div className={styles.mobileSubLinks}>
                  {link.children.map(child => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={styles.mobileSubLink}
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className={styles.mobileActions}>
            <a href={`tel:${PHONE_1}`} className="btn btn-primary w-full" style={{justifyContent:'center'}}>
              📞 Call Us: {PHONE_1}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp w-full"
              style={{justifyContent:'center'}}
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
