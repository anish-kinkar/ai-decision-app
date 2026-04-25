import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRight, BarChart3, ShieldAlert, Zap } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <div>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Make Decisions With <br />
          <span className={styles.highlight}>Mathematical Precision</span>
        </h1>
        <p className={styles.subtitle}>
          An AI-powered decision simulator that helps startup teams compare possible outcomes, analyze risks, and simulate revenue impact before making high-stakes business decisions.
        </p>
        
        <div className={styles.actions}>
          <Link href="/simulate">
            <Button size="large" variant="primary">
              Start Simulation <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/methodology">
            <Button size="large" variant="outline">
              How it works
            </Button>
          </Link>
        </div>

        <div className={styles.features}>
          <Card className={styles.featureCard} hoverable>
            <div className={styles.featureIcon}><Zap size={32} /></div>
            <h3>Multi-Agent Reasoning</h3>
            <p style={{color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.875rem'}}>
              5 specialized AI agents break down your business context, generate realistic scenarios, and recommend action plans.
            </p>
          </Card>
          <Card className={styles.featureCard} hoverable>
            <div className={styles.featureIcon}><BarChart3 size={32} /></div>
            <h3>Numerical Estimation</h3>
            <p style={{color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.875rem'}}>
              Get mathematical estimates for revenue impact, customer churn, and payback periods based on your inputs.
            </p>
          </Card>
          <Card className={styles.featureCard} hoverable>
            <div className={styles.featureIcon}><ShieldAlert size={32} /></div>
            <h3>Risk Mitigation</h3>
            <p style={{color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.875rem'}}>
              Identify hidden trade-offs, second-order effects, and failure modes before you commit to a strategy.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
