'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Calculator } from 'lucide-react';
import styles from './page.module.css';

const DEMO_SCENARIOS = [
  "What if we increase SaaS pricing by 20%?",
  "What if we cut marketing spend by 30%?",
  "What if we hire 3 more engineers?",
  "What if we launch a freemium plan?"
];

export default function SimulatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    decision: '',
    companyType: 'B2B SaaS',
    industry: 'Software',
    goal: 'Revenue Growth',
    revenue: '10000',
    customers: '500',
    conversionRate: '2.5',
    pricing: '99',
    marketingSpend: '2000'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleDemoClick = (decision: string) => {
    setFormData(prev => ({ ...prev, decision }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      // Store in local storage to access on dashboard page
      const id = Date.now().toString();
      const historyStr = localStorage.getItem('simulationHistory') || '[]';
      const history = JSON.parse(historyStr);
      
      const newRecord = {
        id,
        date: new Date().toISOString(),
        inputs: formData,
        results: data,
        title: formData.decision,
        score: data.decisionScore,
        verdict: data.verdict
      };
      
      localStorage.setItem('simulationHistory', JSON.stringify([newRecord, ...history]));
      
      // Navigate to dashboard
      router.push(`/dashboard/${id}`);
    } catch (error) {
      console.error('Simulation failed', error);
      alert('Simulation failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>New Simulation</h1>
        <p className={styles.subtitle}>Define your business context and the decision you want to evaluate.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.fullWidth}>
              <Input 
                id="decision" 
                label="The Business Decision" 
                placeholder="e.g. What if we increase our SaaS pricing from $99/month to $129/month?" 
                value={formData.decision}
                onChange={handleChange}
                required
              />
            </div>
            
            <Select 
              id="companyType" 
              label="Company Type" 
              value={formData.companyType}
              onChange={handleChange}
              options={[
                { value: 'B2B SaaS', label: 'B2B SaaS' },
                { value: 'B2C App', label: 'B2C App' },
                { value: 'E-commerce', label: 'E-commerce' },
                { value: 'Marketplace', label: 'Marketplace' },
                { value: 'Agency/Services', label: 'Agency/Services' }
              ]}
            />
            
            <Select 
              id="goal" 
              label="Primary Goal" 
              value={formData.goal}
              onChange={handleChange}
              options={[
                { value: 'Revenue Growth', label: 'Revenue Growth' },
                { value: 'Cost Reduction', label: 'Cost Reduction' },
                { value: 'Retention', label: 'Retention' },
                { value: 'User Growth', label: 'User Growth' },
                { value: 'Profitability', label: 'Profitability' }
              ]}
            />
            
            <Input id="revenue" label="Current MRR/Revenue ($)" type="number" value={formData.revenue} onChange={handleChange} />
            <Input id="customers" label="Current Customers" type="number" value={formData.customers} onChange={handleChange} />
            <Input id="pricing" label="Avg Pricing per Customer ($)" type="number" value={formData.pricing} onChange={handleChange} />
            <Input id="conversionRate" label="Conversion Rate (%)" type="number" step="0.1" value={formData.conversionRate} onChange={handleChange} />
            <Input id="marketingSpend" label="Monthly Marketing Spend ($)" type="number" value={formData.marketingSpend} onChange={handleChange} />
          </div>

          <div className={styles.submitArea}>
            <Button type="submit" size="large" isLoading={isLoading}>
              <Calculator size={18} /> Run AI Simulation
            </Button>
          </div>
        </form>
      </Card>

      <div className={styles.demoArea}>
        <h3>Quick Demo Scenarios</h3>
        <p className={styles.subtitle}>Try one of these pre-filled examples.</p>
        <div className={styles.demoButtons}>
          {DEMO_SCENARIOS.map((scenario, idx) => (
            <Button 
              key={idx} 
              variant="secondary" 
              onClick={() => handleDemoClick(scenario)}
            >
              {scenario}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
