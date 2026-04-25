import React from 'react';
import { Card } from '@/components/ui/Card';
import { BrainCircuit, Calculator, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';

export default function MethodologyPage() {
  const steps = [
    {
      icon: <FileText size={24} className="text-primary" />,
      title: '1. Business Context Agent',
      desc: 'Parses your inputs into a structured business profile. It understands the constraints of your industry (e.g., B2B SaaS vs E-commerce) and establishes a mathematical baseline.'
    },
    {
      icon: <Calculator size={24} className="text-primary" />,
      title: '2. Scenario Simulation Agent',
      desc: 'Generates Optimistic, Realistic, and Pessimistic scenarios using estimated numerical impact. It calculates changes in MRR, churn, and conversion rates.'
    },
    {
      icon: <ShieldAlert size={24} className="text-primary" />,
      title: '3. Risk Analyst Agent',
      desc: 'Identifies top risks, hidden trade-offs, and second-order effects. It assigns severity scores and proposes mitigation strategies.'
    },
    {
      icon: <CheckCircle2 size={24} className="text-primary" />,
      title: '4. Recommendation Agent',
      desc: 'Compares scenarios and calculates a Decision Score (0-100). It assigns a final verdict: Go, Test First, Needs More Data, or No-Go.'
    },
    {
      icon: <BrainCircuit size={24} className="text-primary" />,
      title: '5. Executive Summary Agent',
      desc: 'Synthesizes the entire pipeline into a highly readable, founder-friendly dashboard with key numbers, charts, and actionable next steps.'
    }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Methodology</h1>
        <p style={{ color: 'var(--muted)' }}>How the AI Decision Simulator works under the hood.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Card>
          <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>The Multi-Agent Workflow</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
            Instead of relying on a single large language model prompt to give an opinion, this engine uses a specialized workflow. 
            Five distinct "agents" process your decision in sequence. The output of one agent becomes the context for the next, 
            ensuring mathematical consistency, logical risk analysis, and a structured final recommendation.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {steps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div style={{ color: 'var(--primary)', marginTop: '0.25rem' }}>{step.icon}</div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{step.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card>
          <h2 style={{ marginBottom: '1rem' }}>Disclaimer</h2>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
            The AI Decision Simulator is an estimation engine designed to help teams compare possible outcomes before making high-stakes business decisions.
            It does not claim perfect prediction. The numbers and scenarios generated are educated estimates based on standard business heuristics. 
            Always combine these insights with real-world testing and domain expertise.
          </p>
        </Card>
      </div>
    </div>
  );
}
