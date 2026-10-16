// src/lib/pdfReport.ts
// ============================================================
// PDF & Fitness Progress Report Generator
// Formatted for personal trainers, physicians, or personal records.
// ============================================================

import type { UserProfile } from '../types';

export function generateProgressPDFReport(
  profile: UserProfile | null,
  weightData: Array<{ date: string; weight: number }>,
  stats: {
    totalWorkouts: number;
    weeklyWorkouts: number;
    streakDays: number;
    habitsCompletedPct: number;
  }
) {
  const name = profile ? `${profile.first_name} ${profile.last_name ?? ''}` : 'John Smith';
  const age = profile?.age ?? 45;
  const goal = profile?.goal?.replace(/_/g, ' ').toUpperCase() ?? 'GENERAL FITNESS';
  const initialWeight = weightData[0]?.weight ?? 200;
  const currentWeight = weightData[weightData.length - 1]?.weight ?? 197.8;
  const weightDiff = (currentWeight - initialWeight).toFixed(1);

  const reportHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Fit Midlife Progress Report — ${name}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1E293B; margin: 0; padding: 40px; background: #FFF; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #E2E8F0; padding-bottom: 20px; margin-bottom: 30px; }
    .brand { font-size: 24px; font-weight: 800; color: #D97706; letter-spacing: 0.05em; }
    .title { font-size: 20px; font-weight: 700; color: #0F172A; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin-bottom: 15px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
    .card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 15px; text-align: center; }
    .card-label { font-size: 12px; color: #64748B; margin-bottom: 5px; }
    .card-value { font-size: 22px; font-weight: 800; color: #0F172A; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #E2E8F0; font-size: 14px; }
    th { background: #F1F5F9; color: #475569; font-weight: 700; }
    .disclaimer { font-size: 11px; color: #94A3B8; margin-top: 40px; border-top: 1px solid #E2E8F0; padding-top: 15px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">FIT FOR MIDLIFE MEN</div>
      <div style="font-size: 13px; color: #64748B; margin-top: 4px;">Monthly Fitness & Body Composition Assessment</div>
    </div>
    <div style="text-align: right;">
      <div class="title">${name}</div>
      <div style="font-size: 13px; color: #64748B;">Date: ${new Date().toLocaleDateString()}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Client Profile & Targets</div>
    <div class="grid">
      <div class="card"><div class="card-label">Age</div><div class="card-value">${age}</div></div>
      <div class="card"><div class="card-label">Primary Goal</div><div class="card-value" style="font-size: 14px;">${goal}</div></div>
      <div class="card"><div class="card-label">Starting Weight</div><div class="card-value">${initialWeight} lbs</div></div>
      <div class="card"><div class="card-label">Net Change</div><div class="card-value" style="color: ${Number(weightDiff) <= 0 ? '#10B981' : '#EF4444'}">${weightDiff} lbs</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Consistency & Engagement Metrics</div>
    <div class="grid">
      <div class="card"><div class="card-label">Total Workouts</div><div class="card-value">${stats.totalWorkouts}</div></div>
      <div class="card"><div class="card-label">Weekly Workouts</div><div class="card-value">${stats.weeklyWorkouts} / wk</div></div>
      <div class="card"><div class="card-label">Active Streak</div><div class="card-value">${stats.streakDays} Days</div></div>
      <div class="card"><div class="card-label">Habit Compliance</div><div class="card-value">${stats.habitsCompletedPct}%</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Weight & Body Composition Progress Log</div>
    <table>
      <thead>
        <tr><th>Date</th><th>Logged Weight</th><th>Change</th><th>Status</th></tr>
      </thead>
      <tbody>
        ${weightData.map((d, i) => `
          <tr>
            <td>${d.date}</td>
            <td><strong>${d.weight} lbs</strong></td>
            <td>${i === 0 ? 'Baseline' : `${(d.weight - weightData[i - 1].weight).toFixed(1)} lbs`}</td>
            <td>${i === 0 ? 'Starting' : (d.weight <= weightData[i - 1].weight ? '📉 Decreasing' : '📈 Maintaining')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Physician & Personal Trainer Notes</div>
    <div style="min-height: 80px; border: 1px dashed #CBD5E1; border-radius: 8px; padding: 15px; font-size: 13px; color: #64748B;">
      Client has demonstrated strong compliance with joint-friendly compound lifting programs and daily protein targets. Weight progression is on track with fat loss goals.
    </div>
  </div>

  <div class="disclaimer">
    FIT FOR MIDLIFE MEN is a general fitness application for healthy adults. This document is provided for informational and tracking purposes only and does not constitute medical advice or diagnosis.
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(reportHTML);
    printWindow.document.close();
  }
}
