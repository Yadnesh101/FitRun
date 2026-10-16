// src/lib/stripe.ts
// ============================================================
// Stripe Service Integration & Checkout Helpers
// Supports both simulated test card environment and real Stripe publishable key
// ============================================================

export interface SubscriptionPlan {
  id: 'pro_monthly' | 'annual_yearly';
  name: string;
  price: string;
  amountCents: number;
  interval: 'month' | 'year';
  description: string;
  features: string[];
}

export const PLANS: Record<string, SubscriptionPlan> = {
  pro_monthly: {
    id: 'pro_monthly',
    name: 'Fit Midlife Pro (Monthly)',
    price: '$19.99',
    amountCents: 1999,
    interval: 'month',
    description: 'Full access to all 4-Day Fat Loss programs, AI Coach, and custom nutrition target tools.',
    features: [
      'Access to 4-Day Fat Loss Builder & 3-Day Strength Builder',
      'Unlimited Fit Coach AI training & nutrition guidance',
      'Custom TDEE, Protein & Macro calculators',
      'Advanced Progress Charts & Body Measurement loggers',
      'Cancel anytime with 1 click',
    ],
  },
  annual_yearly: {
    id: 'annual_yearly',
    name: 'Fit Midlife Annual (Best Value)',
    price: '$149.00',
    amountCents: 14900,
    interval: 'year',
    description: 'Save $90/year with annual billing + early access to all new programs.',
    features: [
      'Everything in Pro Monthly',
      'Save $90 per year (38% discount)',
      'Priority Fit Coach AI response queue',
      'Annual Progress & Strength Assessment',
      '30-day money-back guarantee',
    ],
  },
};

export interface PaymentReceipt {
  transactionId: string;
  planName: string;
  amountPaid: string;
  date: string;
  cardLast4: string;
  cardBrand: string;
  customerName: string;
  customerEmail: string;
}

export function generateMockReceipt(
  planId: 'pro_monthly' | 'annual_yearly',
  customerName: string,
  customerEmail: string,
  cardNumber: string,
  paymentMethod: 'card' | 'paypal' = 'card'
): PaymentReceipt {
  const plan = PLANS[planId] || PLANS.pro_monthly;
  const last4 = paymentMethod === 'paypal' ? 'PayPal' : (cardNumber.replace(/\s/g, '').slice(-4) || '4242');
  return {
    transactionId: `tx_midlife_${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
    planName: plan.name,
    amountPaid: plan.price,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    cardLast4: last4,
    cardBrand: paymentMethod === 'paypal' ? 'PayPal Express' : (cardNumber.startsWith('5') ? 'Mastercard' : 'Visa'),
    customerName: customerName || 'Valued Member',
    customerEmail: customerEmail || 'member@fitmidlife.com',
  };
}
