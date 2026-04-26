'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, AlertTriangle, ShieldCheck, HelpCircle, TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
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
      case 'High':
      case 'Critical': return <AlertTriangle size={24} color="var(--danger)" />;
      case 'Medium': return <HelpCircle size={24} color="var(--warning)" />;
      case 'Low': return <ShieldCheck size={24} color="var(--success)" />;
      default: return null;
    }
  };

  const getRiskClass = (severity: string) => {
    switch (severity) {
      case 'High':
      case 'Critical': return styles.riskHigh;
      case 'Medium': return styles.riskMedium;
      case 'Low': return styles.riskLow;
      default: return '';
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  const formatNumber = (val: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val);

  const getChangeClass = (pct: number, isCost = false) => {
    if (pct > 0) return isCost ? styles.changeNegative : styles.changePositive;
    if (pct < 0) return isCost ? styles.changePositive : styles.changeNegative;
    return styles.changeNeutral;
  };

  const getChangeIcon = (pct: number) => {
    if (pct > 0) return <TrendingUp size={14} style={{ marginRight: '4px' }} />;
    if (pct < 0) return <TrendingDown size={14} style={{ marginRight: '4px' }} />;
    return <Minus size={14} style={{ marginRight: '4px' }} />;
  };

  // Safe fallback if the old API schema is loaded
  const bi = results.businessImpact || {};
  const expl = results.decisionExplanation || {};

  return (
    <div className={styles.container}>
      <Button variant="outline" onClick={() => router.push('/simulate')} style={{ width: 'fit-content' }}>
        <ArrowLeft size={16} /> Back to Input
      </Button>

      <div className={styles.header}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Decision Impact Report</h1>
          <p style={{ color: 'var(--muted)' }}>Context: {inputs.decision}</p>
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
        </Card>
      </div>



      {bi.revenueBefore && (
        <Card title="Business Impact: Before vs After">
          <div className={styles.impactGrid}>
            <div className={styles.impactCard}>
              <h4>Monthly Revenue</h4>
              <div className={styles.impactValues}>
                <span className={styles.valBefore}>{formatCurrency(bi.revenueBefore)}</span>
                <span className={styles.valAfter}>{formatCurrency(bi.revenueAfter)}</span>
              </div>
              <div className={`${styles.impactChange} ${getChangeClass(bi.revenueChangePct)}`}>
                {getChangeIcon(bi.revenueChangePct)}
                {formatCurrency(bi.revenueChange)} ({bi.revenueChangePct > 0 ? '+' : ''}{bi.revenueChangePct.toFixed(1)}%)
              </div>
            </div>

            <div className={styles.impactCard}>
              <h4>Customer / User Base</h4>
              <div className={styles.impactValues}>
                <span className={styles.valBefore}>{formatNumber(bi.customersBefore)}</span>
                <span className={styles.valAfter}>{formatNumber(bi.customersAfter)}</span>
              </div>
              <div className={`${styles.impactChange} ${getChangeClass(bi.customersChangePct)}`}>
                {getChangeIcon(bi.customersChangePct)}
                {formatNumber(bi.customersChange)} ({bi.customersChangePct > 0 ? '+' : ''}{bi.customersChangePct.toFixed(1)}%)
              </div>
            </div>

            <div className={styles.impactCard}>
              <h4>Marketing Spend</h4>
              <div className={styles.impactValues}>
                <span className={styles.valBefore}>{formatCurrency(bi.marketingSpendBefore)}</span>
                <span className={styles.valAfter}>{formatCurrency(bi.marketingSpendAfter)}</span>
              </div>
              <div className={`${styles.impactChange} ${getChangeClass((bi.marketingSpendAfter - bi.marketingSpendBefore), true)}`}>
                {getChangeIcon(bi.marketingSpendAfter - bi.marketingSpendBefore)}
                {formatCurrency(bi.marketingSpendAfter - bi.marketingSpendBefore)}
              </div>
            </div>
          </div>

          <div className={styles.explanationGrid}>
            <div className={styles.impactCard}>
              <h4>Additional Projections</h4>
              <ul style={{ listStyle: 'none', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li className={styles.scenarioMetric}><span>Profitability Impact:</span> <span>{bi.profitabilityImpact}</span></li>
                <li className={styles.scenarioMetric}><span>Churn Risk Impact:</span> <span>{bi.churnRiskImpact}</span></li>
                <li className={styles.scenarioMetric}><span>Time to Impact:</span> <span>{bi.timeToImpact}</span></li>
                <li className={styles.scenarioMetric}><span>Break-Even Point:</span> <span>{bi.breakEvenPoint}</span></li>
              </ul>
            </div>

            {expl.improves && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className={`${styles.explanationBox} ${styles.improves}`}>
                  <strong style={{ color: 'var(--success)', display: 'block', marginBottom: '0.25rem' }}>What Improves:</strong>
                  <span style={{ fontSize: '0.875rem' }}>{expl.improves}</span>
                </div>
                <div className={`${styles.explanationBox} ${styles.worsens}`}>
                  <strong style={{ color: 'var(--danger)', display: 'block', marginBottom: '0.25rem' }}>What Worsens / Risks:</strong>
                  <span style={{ fontSize: '0.875rem' }}>{expl.worsens}</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {expl.monitorWeekly && (
        <div className={styles.grid2}>
          <Card title="Decision Impact Explanation">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--muted)', fontSize: '0.875rem' }}>Most Affected Metric:</strong>
                <p>{expl.mostAffectedMetric}</p>
              </div>
              <div>
                <strong style={{ display: 'block', color: 'var(--muted)', fontSize: '0.875rem' }}>What to Monitor Weekly:</strong>
                <p>{expl.monitorWeekly}</p>
              </div>
              <div>
                <strong style={{ display: 'block', color: 'var(--muted)', fontSize: '0.875rem' }}>Reversibility:</strong>
                <p>{expl.reversibility}</p>
              </div>
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
      )}

      <Card title="Best Case / Expected Case / Worst Case">
        <div className={styles.scenarioCards} style={{ marginTop: '1rem' }}>
          {results.scenarios.map((s: any, idx: number) => (
            <div key={idx} className={styles.scenarioCard} style={{ 
              borderColor: s.name === 'Best Case' ? 'var(--success)' : s.name === 'Worst Case' ? 'var(--danger)' : 'var(--card-border)' 
            }}>
              <h4 style={{ 
                color: s.name === 'Best Case' ? 'var(--success)' : s.name === 'Worst Case' ? 'var(--danger)' : 'var(--primary)' 
              }}>{s.name}</h4>
              
              <div className={styles.scenarioMetric}>
                <span>Projected Revenue:</span>
                <span>{formatCurrency(s.impact)}</span>
              </div>
              {s.customerImpact && (
                <div className={styles.scenarioMetric}>
                  <span>Customer Impact:</span>
                  <span>{formatNumber(s.customerImpact)}</span>
                </div>
              )}
              {s.costImpact && (
                <div className={styles.scenarioMetric}>
                  <span>Cost Impact:</span>
                  <span>{formatCurrency(s.costImpact)}</span>
                </div>
              )}
              {s.riskLevel && (
                <div className={styles.scenarioMetric}>
                  <span>Risk Level:</span>
                  <span className={getRiskClass(s.riskLevel)} style={{ borderLeft: 'none', paddingLeft: 0, color: s.riskLevel === 'Low' ? 'var(--success)' : s.riskLevel === 'High' ? 'var(--danger)' : 'var(--warning)' }}>
                    {s.riskLevel}
                  </span>
                </div>
              )}
              <div className={styles.scenarioMetric}>
                <span>Confidence Score:</span>
                <span>{s.confidence}%</span>
              </div>

              <div className={styles.scenarioCause}>
                <strong>Cause: </strong> {s.cause || s.explanation}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className={styles.grid2} style={{ marginTop: '1.5rem' }}>
        <Card title="Recommendation With Action Plan">
          <p style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>{results.recommendation.text}</p>
          <h4 style={{ marginBottom: '0.75rem' }}>Step-by-Step Action Plan:</h4>
          <ul className={styles.nextStepsList}>
            {results.recommendation.nextSteps.map((step: string, idx: number) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </Card>

        <Card title="Assumptions Used">
          <p style={{ color: 'var(--muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            The AI engine used the following assumptions based on the provided inputs and standard business modeling:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {results.assumptions && results.assumptions.map((assumption: string, idx: number) => (
              <li key={idx} style={{ color: 'var(--foreground)' }}>{assumption}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
