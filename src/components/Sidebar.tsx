'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrainCircuit, LayoutDashboard, Calculator, History, BookOpen, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/simulate', label: 'New Simulation', icon: Calculator },
    { href: '/history', label: 'History', icon: History },
    { href: '/methodology', label: 'Methodology', icon: BookOpen },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <BrainCircuit className={styles.icon} size={28} />
        <span>What-if Engine</span>
      </div>
      
      <nav className={styles.nav}>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          onClick={toggleTheme} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            color: 'var(--muted)', background: 'var(--overlay-05)', 
            padding: '0.5rem 0.75rem', borderRadius: '8px',
            fontSize: '0.875rem', fontWeight: 500
          }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <p>AI Decision Simulator v1.0</p>
      </div>
    </aside>
  );
}
