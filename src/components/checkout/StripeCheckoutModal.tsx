// src/components/checkout/StripeCheckoutModal.tsx

import { useState } from 'react';
import { CreditCard, Lock, CheckCircle2, ShieldCheck, Download, X, Sparkles } from 'lucide-react';
import { PLANS, generateMockReceipt, type PaymentReceipt } from '../../lib/stripe';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

interface StripeCheckoutModalProps {
  initialPlan?: 'pro_monthly' | 'annual_yearly';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (receipt: PaymentReceipt) => void;
  customerName?: string;
  customerEmail?: string;
}

export default function StripeCheckoutModal({
  initialPlan = 'pro_monthly',
  isOpen,
  onClose,
  onSuccess,
  customerName = 'John Smith',
  customerEmail = 'john@example.com',
}: StripeCheckoutModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<'pro_monthly' | 'annual_yearly'>(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [zip, setZip] = useState('');
  const [nameOnCard, setNameOnCard] = useState(customerName);
  const [paypalEmail, setPaypalEmail] = useState(customerEmail);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<PaymentReceipt | null>(null);

  if (!isOpen) return null;

  const plan = PLANS[selectedPlanId];

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvc('123');
    setZip('90210');
    toast.success('Filled with test Visa card (4242...)');
  };

  const handleFormatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = v.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleFormatExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 3) {
      v = `${v.substring(0, 2)}/${v.substring(2)}`;
    }
    setExpiry(v);
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Please enter a valid 16-digit card number');
        return;
      }
      if (!expiry || expiry.length < 5) {
        toast.error('Please enter a valid expiry date (MM/YY)');
        return;
      }
      if (!cvc || cvc.length < 3) {
        toast.error('Please enter a valid 3-digit CVC');
        return;
      }
    } else if (paymentMethod === 'paypal') {
      if (!paypalEmail || !paypalEmail.includes('@')) {
        toast.error('Please enter a valid PayPal account email');
        return;
      }
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const receipt = generateMockReceipt(
        selectedPlanId,
        paymentMethod === 'paypal' ? 'PayPal Member' : nameOnCard,
        paymentMethod === 'paypal' ? paypalEmail : customerEmail,
        cardNumber,
        paymentMethod
      );
      setCompletedReceipt(receipt);
      onSuccess(receipt);
      toast.success(`🎉 Subscription active! Welcome to Fit Midlife Pro!`, { duration: 5000 });
    }, 1800);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(9, 11, 16, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div className="card card-gold animate-fade-in" style={{ maxWidth: 520, width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: 36, height: 36, background: 'var(--grad-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={20} color="#0F1117" />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, lineHeight: 1.2 }}>
                {completedReceipt ? 'Payment Confirmation' : 'Secure Checkout'}
              </h3>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Lock size={12} color="var(--clr-success)" /> 256-Bit SSL Encrypted
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--clr-text-3)', cursor: 'pointer', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Success Screen */}
        {completedReceipt ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: 64, height: 64, background: 'rgba(34,212,122,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle2 size={36} color="var(--clr-success)" />
            </div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, marginBottom: '0.5rem' }}>Payment Successful!</h2>
            <p style={{ color: 'var(--clr-text-2)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
              Your {completedReceipt.planName} membership is now active.
            </p>

            <div style={{ background: 'var(--clr-bg-3)', borderRadius: 'var(--radius-md)', padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem', border: '1px solid var(--clr-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>
                <span>Transaction ID: {completedReceipt.transactionId}</span>
                <span>{completedReceipt.date}</span>
              </div>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--clr-primary)' }}>
                {completedReceipt.planName}
              </div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 900, marginBottom: '0.75rem' }}>
                {completedReceipt.amountPaid}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-2)' }}>
                Paid with {completedReceipt.cardBrand} ({completedReceipt.cardLast4})
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button block variant="secondary" onClick={() => window.print()}>
                <Download size={16} /> Print Receipt
              </Button>
              <Button block onClick={onClose}>
                Start Training Now
              </Button>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <form onSubmit={handlePaySubmit}>
            {/* Plan Switcher */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                onClick={() => setSelectedPlanId('pro_monthly')}
                style={{
                  padding: '0.875rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  border: selectedPlanId === 'pro_monthly' ? '2px solid var(--clr-primary)' : '1px solid var(--clr-border)',
                  background: selectedPlanId === 'pro_monthly' ? 'rgba(232,160,32,0.08)' : 'var(--clr-bg-3)',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Pro Monthly</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 900, color: 'var(--clr-primary)' }}>$19.99<span style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>/mo</span></div>
              </div>
              <div
                onClick={() => setSelectedPlanId('annual_yearly')}
                style={{
                  padding: '0.875rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', position: 'relative',
                  border: selectedPlanId === 'annual_yearly' ? '2px solid var(--clr-primary)' : '1px solid var(--clr-border)',
                  background: selectedPlanId === 'annual_yearly' ? 'rgba(232,160,32,0.08)' : 'var(--clr-bg-3)',
                }}
              >
                <span className="badge badge-primary" style={{ position: 'absolute', top: -8, right: 8, fontSize: '0.65rem' }}>Save 38%</span>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Annual Pass</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 900, color: 'var(--clr-primary)' }}>$149.00<span style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>/yr</span></div>
              </div>
            </div>

            {/* Payment Method Selector Tabs (Stripe vs PayPal) */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--clr-text-2)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                PAYMENT METHOD
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    border: paymentMethod === 'card' ? '2px solid var(--clr-primary)' : '1px solid var(--clr-border)',
                    background: paymentMethod === 'card' ? 'rgba(232,160,32,0.12)' : 'var(--clr-bg-3)',
                    color: paymentMethod === 'card' ? 'var(--clr-primary)' : 'var(--clr-text-2)',
                    fontWeight: 700, fontSize: 'var(--text-sm)',
                  }}
                >
                  <CreditCard size={16} /> Credit / Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    border: paymentMethod === 'paypal' ? '2px solid #FFC439' : '1px solid var(--clr-border)',
                    background: paymentMethod === 'paypal' ? 'rgba(255, 196, 57, 0.12)' : 'var(--clr-bg-3)',
                    color: paymentMethod === 'paypal' ? '#FFC439' : 'var(--clr-text-2)',
                    fontWeight: 700, fontSize: 'var(--text-sm)',
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 900, fontStyle: 'italic', color: '#003087' }}>P</span>
                  <span style={{ fontSize: '1rem', fontWeight: 900, fontStyle: 'italic', color: '#0079C1', marginLeft: -6 }}>P</span>
                  PayPal
                </button>
              </div>
            </div>

            {/* CARD PAYMENT FORM */}
            {paymentMethod === 'card' && (
              <>
                {/* Test Card Quick Fill Banner */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
                  borderRadius: 'var(--radius-md)', padding: '0.625rem 0.875rem', marginBottom: '1.25rem',
                }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: '#60A5FA', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Sparkles size={14} /> Demo Mode: Use Stripe test card
                  </div>
                  <button
                    type="button"
                    onClick={handleFillTestCard}
                    style={{ background: '#3B82F6', color: '#FFF', border: 'none', borderRadius: '4px', padding: '0.25rem 0.625rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Auto-fill 4242
                  </button>
                </div>

                {/* Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
                  <Input
                    id="card-name"
                    label="Cardholder Name"
                    value={nameOnCard}
                    onChange={e => setNameOnCard(e.target.value)}
                    placeholder="John Smith"
                    required
                  />

                  <Input
                    id="card-number"
                    label="Card Number"
                    value={cardNumber}
                    onChange={handleFormatCardNumber}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    required
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <Input
                      id="card-expiry"
                      label="Expires"
                      value={expiry}
                      onChange={handleFormatExpiry}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                    <Input
                      id="card-cvc"
                      label="CVC"
                      value={cvc}
                      onChange={e => setCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                    <Input
                      id="card-zip"
                      label="ZIP Code"
                      value={zip}
                      onChange={e => setZip(e.target.value.substring(0, 6))}
                      placeholder="90210"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* PAYPAL PAYMENT FORM */}
            {paymentMethod === 'paypal' && (
              <div style={{
                background: 'rgba(0, 48, 135, 0.1)', border: '1.5px solid rgba(0, 121, 193, 0.3)',
                borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ background: '#FFC439', padding: '0.25rem 0.625rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, fontStyle: 'italic', color: '#003087' }}>P</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, fontStyle: 'italic', color: '#0079C1' }}>P</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, fontStyle: 'italic', color: '#003087', marginLeft: '2px' }}>PayPal</span>
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-2)', fontWeight: 600 }}>Express Checkout</span>
                </div>

                <Input
                  id="paypal-email"
                  label="PayPal Account Email"
                  type="email"
                  value={paypalEmail}
                  onChange={e => setPaypalEmail(e.target.value)}
                  placeholder="your-paypal-email@example.com"
                  required
                />
                
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', marginTop: '0.75rem', lineHeight: 1.5 }}>
                  🛡️ You will be redirected to PayPal's secure portal to authorize your payment of <strong>{plan.price}</strong>.
                  Protected by PayPal Buyer Protection.
                </p>
              </div>
            )}

            {/* Order Summary */}
            <div style={{ background: 'var(--clr-bg-3)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem', border: '1px solid var(--clr-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--clr-text-2)' }}>{plan.name}</span>
                <span style={{ fontWeight: 700 }}>{plan.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>
                <span>Sales Tax (Included)</span>
                <span>$0.00</span>
              </div>
              <div style={{ borderTop: '1px solid var(--clr-border)', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 'var(--text-base)' }}>
                <span>Total Due Today</span>
                <span style={{ color: 'var(--clr-primary)' }}>{plan.price}</span>
              </div>
            </div>

            {paymentMethod === 'card' ? (
              <Button block size="lg" loading={isProcessing} type="submit" id="submit-stripe-payment">
                <ShieldCheck size={18} /> Pay {plan.price} & Activate Membership
              </Button>
            ) : (
              <button
                type="submit"
                disabled={isProcessing}
                id="submit-paypal-payment"
                style={{
                  width: '100%', padding: '0.875rem 1.5rem', borderRadius: 'var(--radius-lg)',
                  background: '#FFC439', color: '#003087', border: 'none', cursor: 'pointer',
                  fontWeight: 800, fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(255, 196, 57, 0.3)',
                }}
              >
                {isProcessing ? (
                  <span>Connecting to PayPal...</span>
                ) : (
                  <>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, fontStyle: 'italic', color: '#003087' }}>P</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, fontStyle: 'italic', color: '#0079C1', marginLeft: -4 }}>P</span>
                    <span>Pay with PayPal ({plan.price})</span>
                  </>
                )}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
