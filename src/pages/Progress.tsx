// src/pages/Progress.tsx

import { useState } from 'react';
import { TrendingDown, Scale, Ruler, Activity, Plus, FileText } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatDate } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { generateProgressPDFReport } from '../lib/pdfReport';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

// ---- Demo data ----
const DEMO_WEIGHT_DATA = [
  { date: '2026-09-22', weight: 200.2 },
  { date: '2026-09-25', weight: 199.6 },
  { date: '2026-09-28', weight: 199.0 },
  { date: '2026-10-01', weight: 198.4 },
  { date: '2026-10-05', weight: 197.8 },
];

interface Measurement {
  date: string;
  weight: number;
  waist?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--clr-bg-2)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', marginBottom: '0.25rem' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: p.color }}>
          {p.value} {p.name === 'weight' ? 'lbs' : p.name === 'minutes' ? 'min' : ''}
        </div>
      ))}
    </div>
  );
};

function LogModal({ onClose, onSave }: { onClose: () => void; onSave: (m: Measurement) => void }) {
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');

  const handleSave = () => {
    if (!weight) { toast.error('Weight is required'); return; }
    onSave({
      date: new Date().toISOString(),
      weight: Number(weight),
      waist: waist ? Number(waist) : undefined,
    });
    onClose();
    toast.success('Measurement logged!');
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--clr-bg-2)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', width: '100%', maxWidth: 420, border: '1px solid var(--clr-border)' }}>
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: '1.25rem' }}>Log Measurement</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <Input id="m-weight" label="Weight (lbs)" type="number" placeholder="195.0" value={weight} onChange={e => setWeight(e.target.value)} required />
          <Input id="m-waist" label="Waist (inches, optional)" type="number" placeholder="36.0" value={waist} onChange={e => setWaist(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={onClose} block>Cancel</Button>
          <Button onClick={handleSave} block id="save-measurement-btn">Save Entry</Button>
        </div>
      </div>
    </div>
  );
}

export default function Progress() {
  const { profile } = useAuth();
  const [showLog, setShowLog] = useState(false);
  const [weightData, setWeightData] = useState(DEMO_WEIGHT_DATA);
  const startWeight = weightData[0]?.weight || 0;
  const currentWeight = weightData[weightData.length - 1]?.weight || 0;
  const weightChange = currentWeight - startWeight;

  const addMeasurement = (m: Measurement) => {
    const date = new Date(m.date).toISOString().split('T')[0];
    setWeightData(prev => [...prev, { date, weight: m.weight }]);
  };

  const handleExportPDF = () => {
    generateProgressPDFReport(profile, weightData, {
      totalWorkouts: 12,
      weeklyWorkouts: 3,
      streakDays: 7,
      habitsCompletedPct: 85,
    });
    toast.success('Generated printable PDF progress report!');
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginBottom: '0.5rem' }}>Progress</h1>
          <p style={{ color: 'var(--clr-text-2)' }}>Track your strength & body composition transformation over time.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={handleExportPDF} id="export-pdf-btn">
            <FileText size={18} /> Export Doctor/Trainer PDF
          </Button>
          <Button onClick={() => setShowLog(true)} id="log-measurement-btn">
            <Plus size={18} /> Log Measurement
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          {
            icon: <Scale size={20} color="var(--clr-primary)" />,
            label: 'Current Weight',
            value: `${currentWeight}`,
            unit: 'lbs',
            change: weightChange !== 0 ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} lbs` : null,
            positive: weightChange < 0,
          },
          {
            icon: <TrendingDown size={20} color="var(--clr-success)" />,
            label: 'Total Lost',
            value: Math.abs(weightChange).toFixed(1),
            unit: 'lbs',
            change: `Since ${formatDate(weightData[0]?.date || '', 'MMM d')}`,
            positive: true,
          },
          {
            icon: <Activity size={20} color="var(--clr-info)" />,
            label: 'Workouts Done',
            value: '12',
            unit: 'total',
          },
          {
            icon: <Ruler size={20} color="var(--clr-warning)" />,
            label: 'Days Tracked',
            value: weightData.length.toString(),
            unit: 'entries',
          },
        ].map(({ icon, label, value, unit, change, positive }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem' }}>
              {icon}
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', fontWeight: 600 }}>{label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
              <span className="stat-value">{value}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>{unit}</span>
            </div>
            {change && (
              <div style={{ fontSize: 'var(--text-xs)', color: positive ? 'var(--clr-success)' : 'var(--clr-danger)', marginTop: '0.375rem', fontWeight: 600 }}>
                {change}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '1.5rem' }}>Weight Trend</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--clr-border)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--clr-text-3)" fontSize={12} tickLine={false} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="var(--clr-text-3)" fontSize={12} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="weight" stroke="var(--clr-primary)" strokeWidth={3} dot={{ fill: 'var(--clr-primary)', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showLog && <LogModal onClose={() => setShowLog(false)} onSave={addMeasurement} />}
    </div>
  );
}
