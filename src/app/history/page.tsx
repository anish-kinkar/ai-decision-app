'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, ChevronRight } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const historyStr = localStorage.getItem('simulationHistory') || '[]';
    setHistory(JSON.parse(historyStr));
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Simulation History</h1>
        <p style={{ color: 'var(--muted)' }}>Review your past decisions and outcomes.</p>
      </div>

      {history.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>No simulations found.</p>
          <Link href="/simulate">
            <Button variant="primary">Run your first simulation</Button>
          </Link>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((item) => (
            <Card key={item.id} hoverable>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{item.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--muted)', fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} /> 
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <span>Verdict: <strong style={{ color: 'var(--foreground)' }}>{item.verdict}</strong></span>
                    <span>Score: <strong style={{ color: 'var(--foreground)' }}>{item.score}/100</strong></span>
                  </div>
                </div>
                <Link href={`/dashboard/${item.id}`}>
                  <Button variant="outline">
                    View <ChevronRight size={16} />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
