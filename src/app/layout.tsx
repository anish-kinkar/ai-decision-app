import './globals.css';
import type { Metadata } from 'next';
import React from 'react';
import Sidebar from '@/components/Sidebar';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'AI Decision Simulator | What-if Engine',
  description: 'An AI-powered decision simulator that helps teams compare possible outcomes before making high-stakes business decisions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.container}>
          <Sidebar />
          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  );
}
