'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Combobox, ComboboxOption } from '@/components/ui/Combobox';
import { Button } from '@/components/ui/Button';
import { Calculator, Sparkles, Target, Activity, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

const GOALS = ['Revenue Growth', 'Cost Reduction', 'Retention', 'User Growth', 'Profitability'];

const DEMO_CHIPS = [
  { label: 'Increase pricing by 20%', val: 'What if we increase our SaaS pricing by 20%?' },
  { label: 'Cut marketing spend', val: 'What if we cut marketing spend by 30%?' },
  { label: 'Launch freemium', val: 'What if we launch a freemium plan?' },
  { label: 'Hire 3 engineers', val: 'What if we hire 3 more engineers?' }
];

const COMPANY_TYPES: ComboboxOption[] = [
  // Software / Tech
  { value: 'B2B SaaS', label: 'B2B SaaS', category: 'Software / Tech' },
  { value: 'B2C SaaS', label: 'B2C SaaS', category: 'Software / Tech' },
  { value: 'AI Startup', label: 'AI Startup', category: 'Software / Tech' },
  { value: 'Enterprise Software', label: 'Enterprise Software', category: 'Software / Tech' },
  { value: 'Developer Tools', label: 'Developer Tools', category: 'Software / Tech' },
  { value: 'Cybersecurity Company', label: 'Cybersecurity Company', category: 'Software / Tech' },
  { value: 'FinTech Startup', label: 'FinTech Startup', category: 'Software / Tech' },
  { value: 'HealthTech Startup', label: 'HealthTech Startup', category: 'Software / Tech' },
  { value: 'EdTech Startup', label: 'EdTech Startup', category: 'Software / Tech' },
  { value: 'HRTech Startup', label: 'HRTech Startup', category: 'Software / Tech' },
  { value: 'MarTech Startup', label: 'MarTech Startup', category: 'Software / Tech' },
  { value: 'Productivity Software', label: 'Productivity Software', category: 'Software / Tech' },
  { value: 'Marketplace Platform', label: 'Marketplace Platform', category: 'Software / Tech' },
  { value: 'API Platform', label: 'API Platform', category: 'Software / Tech' },
  { value: 'Cloud Infrastructure', label: 'Cloud Infrastructure Startup', category: 'Software / Tech' },
  
  // Consumer / Commerce
  { value: 'D2C Brand', label: 'D2C Brand', category: 'Consumer / Commerce' },
  { value: 'E-commerce Store', label: 'E-commerce Store', category: 'Consumer / Commerce' },
  { value: 'Subscription Box', label: 'Subscription Box Business', category: 'Consumer / Commerce' },
  { value: 'Consumer Mobile App', label: 'Consumer Mobile App', category: 'Consumer / Commerce' },
  { value: 'Food Delivery', label: 'Food Delivery Business', category: 'Consumer / Commerce' },
  { value: 'Online Marketplace', label: 'Online Marketplace', category: 'Consumer / Commerce' },
  { value: 'Retail Business', label: 'Retail Business', category: 'Consumer / Commerce' },
  { value: 'Fashion Brand', label: 'Fashion / Apparel Brand', category: 'Consumer / Commerce' },
  { value: 'Beauty Brand', label: 'Beauty / Skincare Brand', category: 'Consumer / Commerce' },

  // Services
  { value: 'IT Services', label: 'IT Services Company', category: 'Services' },
  { value: 'Consulting Firm', label: 'Consulting Firm', category: 'Services' },
  { value: 'Digital Marketing Agency', label: 'Digital Marketing Agency', category: 'Services' },
  { value: 'Design Agency', label: 'Design Agency', category: 'Services' },
  { value: 'Freelance', label: 'Freelance / Solo Business', category: 'Services' },
  { value: 'BPO Services', label: 'BPO / Operations Services', category: 'Services' },
  { value: 'Staffing Agency', label: 'Staffing / Recruitment Agency', category: 'Services' },

  // Traditional Business
  { value: 'Restaurant', label: 'Restaurant / Cafe', category: 'Traditional Business' },
  { value: 'Gym', label: 'Gym / Fitness Studio', category: 'Traditional Business' },
  { value: 'Real Estate', label: 'Real Estate Business', category: 'Traditional Business' },
  { value: 'Manufacturing', label: 'Manufacturing Business', category: 'Traditional Business' },
  { value: 'Logistics', label: 'Logistics / Delivery Business', category: 'Traditional Business' },
  { value: 'Healthcare Clinic', label: 'Healthcare Clinic', category: 'Traditional Business' },
  { value: 'Education Institute', label: 'Education Institute', category: 'Traditional Business' },
  { value: 'Travel Business', label: 'Travel / Hospitality Business', category: 'Traditional Business' },

  // Startup Stage
  { value: 'Pre-revenue', label: 'Pre-revenue Startup', category: 'Startup Stage' },
  { value: 'MVP-stage', label: 'MVP-stage Startup', category: 'Startup Stage' },
  { value: 'Early-stage', label: 'Early-stage Startup', category: 'Startup Stage' },
  { value: 'Growth-stage', label: 'Growth-stage Startup', category: 'Startup Stage' },
  { value: 'Enterprise', label: 'Enterprise Business', category: 'Startup Stage' },
  { value: 'Small Business', label: 'Small Business', category: 'Startup Stage' },
  { value: 'Family Business', label: 'Family Business', category: 'Startup Stage' },

  { value: 'Other', label: 'Other (Specify manually)', category: 'Other' }
];

export default function SimulatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    decision: '',
    companyType: 'B2B SaaS',
    customCompanyType: '',
    goal: 'Revenue Growth',
    revenue: '',
    customers: '',
    conversionRate: '',
    pricing: '',
    marketingSpend: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleComboboxChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const setGoal = (goal: string) => {
    setFormData(prev => ({ ...prev, goal }));
  };

  const handleChipClick = (decisionStr: string) => {
    setFormData(prev => ({ ...prev, decision: decisionStr }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!formData.decision || !formData.revenue || !formData.pricing) {
      alert("Please ensure the Decision, Revenue, and Pricing fields are filled out.");
      return;
    }

    setIsLoading(true);
    
    try {
      const payload = {
        ...formData,
        companyType: formData.companyType === 'Other' ? formData.customCompanyType : formData.companyType
      };

      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      const id = Date.now().toString();
      const historyStr = localStorage.getItem('simulationHistory') || '[]';
      const history = JSON.parse(historyStr);
      
      const newRecord = {
        id, date: new Date().toISOString(), inputs: formData, results: data, title: formData.decision, score: data.decisionScore, verdict: data.verdict
      };
      
      localStorage.setItem('simulationHistory', JSON.stringify([newRecord, ...history]));
      router.push(`/dashboard/${id}`);
    } catch (error: any) {
      console.error('Simulation failed', error);
      alert('Simulation failed: ' + (error.message || 'Unknown error'));
      setIsLoading(false);
    }
  };

  // Live Preview Logic
  const readiness = useMemo(() => {
    let score = 0;
    let missing = [];
    if (formData.decision.length > 10) score += 40; else missing.push('Detailed decision');
    if (formData.revenue) score += 20; else missing.push('Revenue');
    if (formData.pricing) score += 20; else missing.push('Pricing');
    if (formData.customers) score += 10;
    if (formData.marketingSpend) score += 10;

    let msg = "Start filling details...";
    let statusClass = styles.low;
    if (score >= 90) { msg = "Excellent! Ready to simulate."; statusClass = styles.high; }
    else if (score >= 60) { msg = "Good enough to run."; statusClass = styles.medium; }
    else if (score >= 40) { msg = "Missing core financial metrics."; statusClass = styles.low; }

    return { score, msg, statusClass, missing };
  }, [formData]);

  const previewInsights = useMemo(() => {
    const d = formData.decision.toLowerCase();
    let type = 'Pending...';
    let impact = 'Unknown';
    let risk = 'Unknown';
    
    if (d.includes('price') || d.includes('pricing')) { type = 'Pricing Change'; impact = 'Revenue & Churn'; risk = 'High'; }
    else if (d.includes('free')) { type = 'Freemium Launch'; impact = 'User Growth & Costs'; risk = 'High'; }
    else if (d.includes('market') || d.includes('spend')) { type = 'Marketing Adj.'; impact = 'Lead Velocity'; risk = 'Medium'; }
    else if (d.includes('hire') || d.includes('team')) { type = 'Headcount Change'; impact = 'Burn Rate & Output'; risk = 'Medium'; }
    else if (d.length > 5) { type = 'General Strategy'; impact = 'Overall Growth'; risk = 'Varies'; }

    return { type, impact, risk };
  }, [formData.decision]);

  return (
    <div className={styles.container}>
      <div className={styles.topHeader}>
        <div className={styles.eyebrow}><Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} /> AI Decision Builder</div>
        <h1 className={styles.title}>New Simulation</h1>
        <p className={styles.subtitle}>Define your business context. Our engine will dynamically model the financial impacts, risks, and recommended actions.</p>
      </div>

      <div className={styles.stepper}>
        <div className={`${styles.step} ${styles.active}`}><div className={styles.stepNumber}>1</div> Context</div>
        <div className={styles.stepSeparator}></div>
        <div className={`${styles.step} ${styles.active}`}><div className={styles.stepNumber}>2</div> Metrics</div>
        <div className={styles.stepSeparator}></div>
        <div className={styles.step}><div className={styles.stepNumber}>3</div> Simulate</div>
      </div>

      <div className={styles.mainLayout}>
        {/* LEFT COLUMN: BUILDER */}
        <div className={styles.leftCol}>
          
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2><Target size={20} className={styles.eyebrow} /> Decision Setup</h2>
            </div>
            
            <Input 
              id="decision" 
              multiline
              label="The Business Decision" 
              placeholder="e.g. What if we increase our SaaS pricing from ₹9900/month to ₹12900/month?" 
              value={formData.decision}
              onChange={handleChange}
              helperText="Be as specific as possible for better AI projections."
            />
            <div className={styles.chipsContainer}>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>Try an example:</span>
              {DEMO_CHIPS.map((chip, idx) => (
                <button key={idx} type="button" className={styles.chip} onClick={() => handleChipClick(chip.val)}>
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2><Activity size={20} className={styles.eyebrow} /> Business Context</h2>
            </div>
            
            <div className={styles.formGrid}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Combobox 
                  id="companyType" 
                  label="Company Type" 
                  value={formData.companyType} 
                  onChange={(val) => handleComboboxChange('companyType', val)}
                  options={COMPANY_TYPES}
                />
                {formData.companyType === 'Other' && (
                  <Input 
                    id="customCompanyType"
                    placeholder="E.g. Space Logistics..."
                    value={formData.customCompanyType}
                    onChange={handleChange}
                    style={{ marginTop: '-0.5rem' }}
                  />
                )}
              </div>
              
              <div className={styles.fullWidth}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Primary Goal</label>
                <div className={styles.pillsContainer}>
                  {GOALS.map(goal => (
                    <button 
                      key={goal} type="button"
                      className={`${styles.pill} ${formData.goal === goal ? styles.active : ''}`}
                      onClick={() => setGoal(goal)}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2><Calculator size={20} className={styles.eyebrow} /> Current Metrics</h2>
            </div>
            
            <div className={styles.formGrid}>
              <Input id="revenue" label="Current Monthly Revenue (₹)" type="number" value={formData.revenue} onChange={handleChange} helperText="Required for financial projections" />
              <Input id="pricing" label="Avg Price per Customer (₹)" type="number" value={formData.pricing} onChange={handleChange} helperText="Required to calculate churn/ARPU" />
              <Input id="customers" label="Current Customers" type="number" value={formData.customers} onChange={handleChange} helperText="Improves accuracy of impact" />
              <Input id="conversionRate" label="Conversion Rate (%)" type="number" step="0.1" value={formData.conversionRate} onChange={handleChange} />
              <Input id="marketingSpend" label="Monthly Marketing Spend (₹)" type="number" value={formData.marketingSpend} onChange={handleChange} />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW */}
        <div className={styles.rightCol}>
          
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <Sparkles size={18} /> Simulation Preview
            </div>

            <div className={styles.readinessContainer}>
              <div className={styles.readinessHeader}>
                <span className={styles.readinessLabel}>Readiness Score</span>
                <span className={styles.readinessScore}>{readiness.score}<span style={{fontSize:'1rem', color:'var(--muted)'}}>/100</span></span>
              </div>
              <div className={styles.progressBar}>
                <div className={`${styles.progressFill} ${readiness.statusClass}`} style={{ width: `${readiness.score}%` }}></div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{readiness.msg}</div>
            </div>

            <div className={styles.previewList}>
              <div className={styles.previewItem}>
                <span className={styles.previewLabel}>Decision Type</span>
                <span className={`${styles.previewValue} ${previewInsights.type.includes('Pending') ? styles.shimmer : ''}`}>{previewInsights.type}</span>
              </div>
              <div className={styles.previewItem}>
                <span className={styles.previewLabel}>Primary Impact</span>
                <span className={`${styles.previewValue} ${previewInsights.impact.includes('Unknown') ? styles.shimmer : ''}`}>{previewInsights.impact}</span>
              </div>
              <div className={styles.previewItem}>
                <span className={styles.previewLabel}>Estimated Risk</span>
                <span className={`${styles.previewValue} ${previewInsights.risk.includes('Unknown') ? styles.shimmer : ''}`}>{previewInsights.risk}</span>
              </div>
              <div className={styles.previewItem}>
                <span className={styles.previewLabel}>Expected Output</span>
                <span className={styles.previewValue}>Financial Projection, Risk Matrix, Action Plan</span>
              </div>
            </div>
          </div>

          <div className={styles.ctaSection}>
            <h3 style={{ fontSize: '1.25rem' }}>Ready to formulate?</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
              The AI engine will generate a full decision report based on these parameters.
            </p>
            <Button 
              size="large" 
              isLoading={isLoading} 
              onClick={() => handleSubmit()} 
              disabled={readiness.score < 80 && !isLoading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Run AI Simulation <ArrowRight size={18} />
            </Button>
            {readiness.score < 80 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--warning)' }}>Fill required fields to simulate</span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
