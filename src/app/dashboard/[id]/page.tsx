'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './page.module.css';

export default function DashboardPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const historyStr = localStorage.getItem('simulationHistory') || '[]';
    const history = JSON.parse(historyStr);
    const simulation = history.find((h: any) => h.id === id);
    
    if (simulation) {
      setData(simulation);
    } else {
      router.push('/simulate');
    }
  }, [id, router]);

  if (!data) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading dashboard...</div>;
  }

  const { results, inputs } = data;
  
  const getVerdictClass = (verdict: string) => {
    switch (verdict) {
      case 'Go': return styles.go;
      case 'Test First': return styles.test;
      case 'Needs More Data': return styles.needsData;
      case 'No-Go': return styles.noGo;
      default: return '';
    }
  };

  const getRiskIcon = (severity: string) => {
    switch (severity) {
      case 'High': return <AlertTriangle size={24} color="var(--danger)" />;
      case 'Medium': return <HelpCircle size={24} color="var(--warning)" />;
      case 'Low': return <ShieldCheck size={24} color="var(--success)" />;
      default: return null;
    }
  };

  const getRiskClass = (severity: string) => {
    switch (severity) {
      case 'High': return styles.riskHigh;
      case 'Medium': return styles.riskMedium;
      case 'Low': return styles.riskLow;
      default: return '';
    }
  };

  const currentRev = parseFloat(inputs.revenue);
  const chartData = [
    { name: 'Current', value: currentRev, fill: 'var(--muted)' },
    ...results.scenarios.map((s: any) => {
      let color = 'var(--primary)';
      if (s.name === 'Optimistic') color = 'var(--success)';
      if (s.name === 'Pessimistic') color = 'var(--danger)';
      return {
        name: s.name,
        value: s.impact,
        fill: color
      };
    })
  ];

  return (
    <div className={styles.container}>
      <Button variant="outline" onClick={() => router.push('/simulate')} style={{ width: 'fit-content' }}>
        <ArrowLeft size={16} /> Back to Input
      </Button>

      <div className={styles.header}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Simulation Results</h1>
          <p style={{ color: 'var(--muted)' }}>Decision: {inputs.decision}</p>
        </div>
      </div>

      <div className={styles.grid3}>
        <Card className={`${styles.scoreCard} ${styles.fullWidth}`} style={{ gridColumn: 'span 1' }}>
          <h3>Decision Score</h3>
          <div className={styles.scoreValue}>{results.decisionScore}</div>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Out of 100</p>
          <div className={`${styles.verdictBadge} ${getVerdictClass(results.verdict)}`}>
            Verdict: {results.verdict}
          </div>
        </Card>

        <Card title="Executive Summary" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            "{results.executiveSummary.oneLine}"
          </h3>
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
            {results.executiveSummary.keyNumbers.map((num: any, idx: number) => (
              <div key={idx}>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{num.label}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{num.value}</div>
              </div>
            ))}
          </div>
          <div>
            <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Key Risk: </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--danger)' }}>{results.executiveSummary.keyRisk}</span>
          </div>
        </Card>
      </div>

      <div className={styles.grid2}>
        <Card title="Financial Impact Scenario">
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--card-border)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Risk Matrix">
          <div style={{ marginTop: '1rem' }}>
            {results.risks.map((risk: any, idx: number) => (
              <div key={idx} className={`${styles.riskItem} ${getRiskClass(risk.severity)}`}>
                {getRiskIcon(risk.severity)}
                <div className={styles.riskContent}>
                  <h4>{risk.risk}</h4>
                  <p><strong>Mitigation:</strong> {risk.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Recommended Action Plan">
        <p style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>{results.recommendation.text}</p>
        <h4 style={{ marginBottom: '0.75rem' }}>Next Steps:</h4>
        <ul className={styles.nextStepsList}>
          {results.recommendation.nextSteps.map((step: string, idx: number) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
