import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the SDK if the API key is present
const API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const getRandomInRange = (min: number, max: number) => min + Math.random() * (max - min);

function classifyDecision(decision: string): string {
  const d = decision.toLowerCase();
  if (d.includes('pricing') || d.includes('price')) return 'pricing';
  if (d.includes('freemium') || d.includes('free tier') || d.includes('free plan')) return 'freemium';
  if (d.includes('marketing') || d.includes('ad spend') || d.includes('advertising')) return 'marketing';
  if (d.includes('hire') || d.includes('hiring') || d.includes('engineers') || d.includes('headcount')) return 'hiring';
  if (d.includes('launch') || d.includes('new product') || d.includes('feature')) return 'product_launch';
  if (d.includes('cut') || d.includes('reduce') || d.includes('layoff')) return 'cost_reduction';
  if (d.includes('expand') || d.includes('new market') || d.includes('country')) return 'expansion';
  if (d.includes('retention') || d.includes('churn')) return 'retention';
  return 'general';
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { decision, revenue, customers, conversionRate, pricing, marketingSpend } = body;

    if (!decision || !revenue || !customers) {
      return NextResponse.json({ error: 'Missing critical inputs. Please provide Revenue and Customers.' }, { status: 400 });
    }

    const currentRev = parseFloat(revenue);
    const currentCust = parseFloat(customers) || 100;
    const convRate = parseFloat(conversionRate) || 2.5;
    const currentPrice = parseFloat(pricing) || (currentRev / currentCust) || 99;
    const mktSpend = parseFloat(marketingSpend) || 0;

    await new Promise(resolve => setTimeout(resolve, 1500));

    const category = classifyDecision(decision);

    let scenarios = [];
    let businessImpact: any = {
      revenueBefore: currentRev,
      customersBefore: currentCust,
      conversionBefore: convRate,
      marketingSpendBefore: mktSpend
    };
    let decisionExplanation: any = {};
    let assumptions = [];
    let actionPlan = [];
    let risks = [];

    // Core dynamic simulation logic
    if (category === 'pricing') {
      const priceIncreasePct = getRandomInRange(0.15, 0.25);
      const newPricing = currentPrice * (1 + priceIncreasePct);
      const churnOpt = getRandomInRange(0.01, 0.03);
      const churnReal = getRandomInRange(0.04, 0.08);
      const churnPess = getRandomInRange(0.12, 0.20);

      const custAfterReal = currentCust * (1 - churnReal);
      const revAfterReal = custAfterReal * newPricing;

      businessImpact = {
        ...businessImpact,
        revenueAfter: revAfterReal,
        revenueChange: revAfterReal - currentRev,
        revenueChangePct: ((revAfterReal - currentRev) / currentRev) * 100,
        customersAfter: custAfterReal,
        customersChange: custAfterReal - currentCust,
        customersChangePct: -churnReal * 100,
        conversionAfter: convRate * 0.8, // Conversion drops slightly
        marketingSpendAfter: mktSpend,
        profitabilityImpact: `Improves by ~${(priceIncreasePct * 100).toFixed(0)}% margin per unit`,
        churnRiskImpact: `Increases baseline churn by ${(churnReal * 100).toFixed(1)}%`,
        timeToImpact: '1-2 Months (Next billing cycle)',
        breakEvenPoint: `${((priceIncreasePct / (1 + priceIncreasePct)) * 100).toFixed(1)}% churn threshold`
      };

      decisionExplanation = {
        improves: 'Average Revenue Per User (ARPU) and gross profitability.',
        worsens: 'Customer retention and new top-of-funnel conversion rate.',
        mostAffectedMetric: 'Monthly Recurring Revenue (MRR) and Churn Rate.',
        monitorWeekly: 'Cancellation feedback and new signup volume.',
        reversibility: 'Highly risky to reverse. Once prices are raised, rolling back signals weakness to the market.'
      };

      scenarios = [
        {
          name: 'Best Case', impact: (currentCust * (1 - churnOpt)) * newPricing, customerImpact: currentCust * (1 - churnOpt),
          costImpact: mktSpend, riskLevel: 'Low', confidence: 20,
          cause: `Users accept the price increase with minimal churn (<${(churnOpt * 100).toFixed(1)}%). Higher ARPU drives significant growth.`
        },
        {
          name: 'Expected Case', impact: revAfterReal, customerImpact: custAfterReal,
          costImpact: mktSpend, riskLevel: 'Medium', confidence: 60,
          cause: `Expected churn of ${(churnReal * 100).toFixed(1)}%, but the higher price point nets a positive outcome.`
        },
        {
          name: 'Worst Case', impact: (currentCust * (1 - churnPess)) * newPricing, customerImpact: currentCust * (1 - churnPess),
          costImpact: mktSpend + (mktSpend * 0.2), riskLevel: 'High', confidence: 20,
          cause: `Massive backlash leading to ${(churnPess * 100).toFixed(1)}% churn. Additional marketing spend needed to recover trust.`
        }
      ];

      actionPlan = [
        `Grandfather existing users on the old ₹${currentPrice.toFixed(0)} plan for 12 months.`,
        `Roll out the new ₹${newPricing.toFixed(0)} pricing only to new signups starting next week.`,
        `Draft a proactive communication email highlighting the new value/features added recently.`
      ];

      risks = [
        { risk: 'Existing customers churn heavily', severity: 'High', mitigation: 'Grandfather existing users' },
        { risk: 'Competitors use it against you', severity: 'Medium', mitigation: 'Update marketing to highlight premium value' }
      ];

      assumptions = [`Estimated Price Increase: ${(priceIncreasePct * 100).toFixed(1)}%`, `Base Churn Assumed: ${(churnReal * 100).toFixed(1)}%`, `Break-even threshold calculated at current volume`];

    } else if (category === 'freemium') {
      const freeUserGrowth = getRandomInRange(5, 10);
      const conversionDropReal = getRandomInRange(0.4, 0.6);

      const newCustBase = currentCust + (currentCust * freeUserGrowth);
      const newConvRate = convRate * (1 - conversionDropReal);
      const newPaidCust = newCustBase * (newConvRate / 100);
      const revAfterReal = newPaidCust * currentPrice;

      businessImpact = {
        ...businessImpact,
        revenueAfter: revAfterReal,
        revenueChange: revAfterReal - currentRev,
        revenueChangePct: ((revAfterReal - currentRev) / currentRev) * 100,
        customersAfter: newCustBase, // Total users
        customersChange: newCustBase - currentCust,
        customersChangePct: freeUserGrowth * 100,
        conversionAfter: newConvRate,
        marketingSpendAfter: mktSpend,
        profitabilityImpact: `Infrastructure/support costs will increase by ~${(freeUserGrowth * 15).toFixed(0)}%`,
        churnRiskImpact: `Low risk to existing MRR, high risk of zombie free users`,
        timeToImpact: '3-6 Months to mature the funnel',
        breakEvenPoint: `Requires ${(currentCust / (newCustBase || 1) * 100).toFixed(2)}% free-to-paid conversion to break even`
      };

      decisionExplanation = {
        improves: 'Brand awareness, total user base, and top-of-funnel volume.',
        worsens: 'Short-term cash flow and support team bandwidth.',
        mostAffectedMetric: 'Total User Count and Overall Conversion Rate.',
        monitorWeekly: 'Free-to-paid upgrade rate and infrastructure server costs.',
        reversibility: 'Moderate. You can stop new free signups, but removing existing free users is a PR risk.'
      };

      scenarios = [
        {
          name: 'Best Case', impact: revAfterReal * 1.5, customerImpact: newCustBase * 1.2,
          costImpact: currentRev * 0.1, riskLevel: 'Medium', confidence: 25,
          cause: `Massive viral loop. Users invite colleagues, expanding the pie and converting to enterprise plans.`
        },
        {
          name: 'Expected Case', impact: revAfterReal, customerImpact: newCustBase,
          costImpact: currentRev * 0.15, riskLevel: 'High', confidence: 50,
          cause: `Top of funnel grows ${freeUserGrowth.toFixed(1)}x, but conversion drops to ${newConvRate.toFixed(2)}%.`
        },
        {
          name: 'Worst Case', impact: currentRev * 0.7, customerImpact: newCustBase * 2,
          costImpact: currentRev * 0.3, riskLevel: 'Critical', confidence: 25,
          cause: `Users downgrade from paid to free. Free users consume massive resources with 0% upgrade rate.`
        }
      ];

      actionPlan = [
        `Define strict feature gates (e.g., limit to 3 projects) to ensure free users hit a paywall.`,
        `Set up automated lifecycle emails targeting free users on Day 3, 7, and 14 to drive upgrades.`,
        `Monitor AWS/Cloud costs daily for the first month to prevent runaway infrastructure spending.`
      ];

      risks = [
        { risk: 'Cannibalization of paid tiers', severity: 'High', mitigation: 'Strip core valuable features from free tier' },
        { risk: 'Support costs explode', severity: 'High', mitigation: 'Community-only support for free tier' }
      ];

      assumptions = [`Top of funnel growth multiplier: ${freeUserGrowth.toFixed(1)}x`, `Conversion rate penalty: ${(conversionDropReal * 100).toFixed(0)}% relative drop`];

    } else if (category === 'marketing') {
      const spendCutPct = getRandomInRange(0.2, 0.4);
      const mktAfter = mktSpend * (1 - spendCutPct);
      const leadDrop = spendCutPct * getRandomInRange(0.8, 1.2);

      const custAfterReal = currentCust * (1 - leadDrop);
      const revAfterReal = custAfterReal * currentPrice;

      businessImpact = {
        ...businessImpact,
        revenueAfter: revAfterReal,
        revenueChange: revAfterReal - currentRev,
        revenueChangePct: ((revAfterReal - currentRev) / currentRev) * 100,
        customersAfter: custAfterReal,
        customersChange: custAfterReal - currentCust,
        customersChangePct: ((custAfterReal - currentCust) / currentCust) * 100,
        conversionAfter: convRate,
        marketingSpendAfter: mktAfter,
        profitabilityImpact: `Immediate cash savings of ₹${(mktSpend - mktAfter).toFixed(0)}/mo`,
        churnRiskImpact: `Neutral`,
        timeToImpact: '1-3 Months (Depending on sales cycle length)',
        breakEvenPoint: `N/A`
      };

      decisionExplanation = {
        improves: 'Short-term cash flow, profitability, and runway.',
        worsens: 'Pipeline generation, new MRR growth, and brand visibility.',
        mostAffectedMetric: 'New Leads Generated and Customer Acquisition Cost (CAC).',
        monitorWeekly: 'Inbound lead volume and organic search traffic.',
        reversibility: 'Easy. You can turn ad campaigns back on instantly, though momentum takes time to rebuild.'
      };

      scenarios = [
        {
          name: 'Best Case', impact: currentRev * 0.98, customerImpact: currentCust * 0.95,
          costImpact: mktAfter, riskLevel: 'Low', confidence: 20,
          cause: `Cut budget is entirely from underperforming campaigns. Organic growth fully offsets the loss.`
        },
        {
          name: 'Expected Case', impact: revAfterReal, customerImpact: custAfterReal,
          costImpact: mktAfter, riskLevel: 'Medium', confidence: 60,
          cause: `Proportional drop in pipeline. Growth slows down, but the business remains stable with better margins.`
        },
        {
          name: 'Worst Case', impact: currentRev * (1 - (leadDrop * 2)), customerImpact: currentCust * (1 - (leadDrop * 2)),
          costImpact: mktAfter, riskLevel: 'High', confidence: 20,
          cause: `Competitors notice your absence and capture your market share. Sales team morale drops due to lack of leads.`
        }
      ];

      actionPlan = [
        `Audit all active campaigns and pause only the bottom 30% of performers (highest CAC).`,
        `Reallocate 10% of the saved budget into high-intent retargeting campaigns.`,
        `Task the sales team to increase outbound outreach by 15% to offset inbound loss.`
      ];

      risks = [
        { risk: 'Pipeline dries up', severity: 'High', mitigation: 'Increase outbound sales efforts' },
        { risk: 'Competitors steal voice', severity: 'Medium', mitigation: 'Maintain presence in cheap organic channels' }
      ];

      assumptions = [`Marketing efficiency factor: 1:1 correlation with top-of-funnel`, `Spend reduction: ${(spendCutPct * 100).toFixed(0)}%`];

    } else {
      // General / Hiring / Cost Reduction fallback logic
      const genericBump = getRandomInRange(1.05, 1.2);
      const revAfterReal = currentRev * genericBump;

      businessImpact = {
        ...businessImpact,
        revenueAfter: revAfterReal,
        revenueChange: revAfterReal - currentRev,
        revenueChangePct: ((revAfterReal - currentRev) / currentRev) * 100,
        customersAfter: currentCust * genericBump,
        customersChange: (currentCust * genericBump) - currentCust,
        customersChangePct: (genericBump - 1) * 100,
        conversionAfter: convRate,
        marketingSpendAfter: mktSpend,
        profitabilityImpact: `Varies based on execution efficiency`,
        churnRiskImpact: `Neutral`,
        timeToImpact: '3-6 Months',
        breakEvenPoint: `N/A`
      };

      decisionExplanation = {
        improves: 'General operational capacity and long-term strategic positioning.',
        worsens: 'Short-term focus and operational complexity.',
        mostAffectedMetric: 'Revenue Growth Rate.',
        monitorWeekly: 'Project milestones and specific OKRs related to this initiative.',
        reversibility: 'Varies. Usually requires significant untangling of resources.'
      };

      scenarios = [
        {
          name: 'Best Case', impact: currentRev * 1.3, customerImpact: currentCust * 1.3,
          costImpact: mktSpend * 1.1, riskLevel: 'Low', confidence: 20,
          cause: `Flawless execution. The market responds perfectly to the initiative.`
        },
        {
          name: 'Expected Case', impact: revAfterReal, customerImpact: currentCust * genericBump,
          costImpact: mktSpend, riskLevel: 'Medium', confidence: 60,
          cause: `Standard roadbumps occur, but the initiative delivers positive ROI within 6 months.`
        },
        {
          name: 'Worst Case', impact: currentRev * 0.9, customerImpact: currentCust * 0.95,
          costImpact: mktSpend * 1.2, riskLevel: 'High', confidence: 20,
          cause: `Initiative completely fails, burning capital and distracting the core team from existing revenue drivers.`
        }
      ];

      actionPlan = [
        `Establish clear KPI targets for the first 30, 60, and 90 days.`,
        `Assign a single Directly Responsible Individual (DRI) to own the execution.`,
        `Review progress in a weekly dedicated sync, not general standups.`
      ];

      risks = [
        { risk: 'Execution delays', severity: 'Medium', mitigation: 'Set strict weekly milestones' },
        { risk: 'Opportunity cost', severity: 'High', mitigation: 'Review against core OKRs' }
      ];

      assumptions = [`Generic impact bounds applied`, `Positive market reception assumed`];
    }

    // Determine Verdict based on expected impact
    const upsidePct = (scenarios[1].impact - currentRev) / currentRev;
    let score = 50 + (upsidePct * 100);
    if (risks.some(r => r.severity === 'High')) score -= 15;
    score = Math.max(10, Math.min(99, Math.round(score)));

    let verdict = 'Needs More Data';
    if (score >= 80) verdict = 'Go';
    else if (score >= 60) verdict = 'Test First';
    else if (score < 40) verdict = 'No-Go';

    const responseData = {
      businessImpact,
      decisionExplanation,
      executiveSummary: {
        oneLine: `Based on a mathematical projection, this decision yields a ${(upsidePct * 100).toFixed(1)}% ${upsidePct > 0 ? 'increase' : 'decrease'} in expected revenue.`,
        keyNumbers: [
          { label: 'Projected Monthly Rev', value: `₹${Math.round(businessImpact.revenueAfter).toLocaleString()}` },
          { label: 'Decision Confidence', value: `${Math.round(getRandomInRange(70, 85))}%` }
        ],
        keyRisk: risks[0].risk,
      },
      decisionScore: score,
      verdict,
      scenarios,
      risks,
      assumptions,
      recommendation: {
        text: verdict === 'Go' ? 'The upside heavily outweighs the risks. Proceed with implementation.' : verdict === 'Test First' ? 'Run a limited pilot to validate assumptions before committing fully.' : 'The mathematical expected value is negative or too risky. Do not proceed.',
        nextSteps: actionPlan
      },
      aiAnalysis: '' // Will be populated by Gemini
    };

    // Generate AI Strategy Analysis using Gemini
    try {
      if (genAI && API_KEY) {
        const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `
          You are a world-class strategic business analyst and AI consultant. 
          A user is considering the following business decision: "${decision}"
          
          Current Metrics:
          - Revenue: ₹${currentRev}
          - Customers: ${currentCust}
          
          Our internal mathematical engine has projected the following:
          - Expected Revenue Change: ${(upsidePct * 100).toFixed(1)}%
          - Primary Risk: ${risks[0]?.risk}
          - Recommendation: ${responseData.recommendation.text}
          
          Write a concise, professional, 2-3 paragraph strategic analysis for the executive dashboard. 
          Focus on market dynamics, unquantifiable risks (like brand reputation or competitor response), and strategic positioning.
          Do NOT output markdown headers like "## Analysis", just provide the raw text paragraphs. Use **bold** for emphasis.
        `;

        const result = await model.generateContent(prompt);
        responseData.aiAnalysis = result.response.text();
      } else {
        responseData.aiAnalysis = "AI Analysis unavailable. GEMINI_API_KEY is not configured.";
      }
    } catch (aiError: any) {
      console.error('Gemini API Error:', aiError);
      responseData.aiAnalysis = `API Error Details: ${aiError.message || JSON.stringify(aiError)}`;
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process simulation' }, { status: 500 });
  }
}
