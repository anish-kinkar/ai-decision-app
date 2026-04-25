'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrainCircuit, LayoutDashboard, Calculator, History, BookOpen } from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();

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

      <div className={styles.footer}>
        <p>AI Decision Simulator v1.0</p>
      </div>
    </aside>
  );
}
