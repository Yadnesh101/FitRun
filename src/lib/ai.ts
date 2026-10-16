// src/lib/ai.ts
// ============================================================
// AI Fit Coach service — provides intelligent, context-aware fitness,
// nutrition, and recovery advice for men 40+.
// Architecture-ready for Gemini / OpenAI API with rich dynamic fallback.
// ============================================================

import type { AIContext, ChatMessage } from '../types';

const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// ---- Safety Guardrails ----

const SAFETY_KEYWORDS = [
  'diagnose', 'prescription', 'medication', 'drug', 'disease', 'cure',
  'medical treatment', 'surgery', 'therapy', 'disorder', 'heart attack',
  'chest pain', 'severe injury', 'torn ligament', 'fracture',
];

const SAFETY_DISCLAIMER =
  "I'm Fit Coach, focused on general fitness and wellness for men 40+. " +
  "I am not a physician or medical professional. If you are experiencing sharp pain, dizziness, or chest discomfort, please stop exercising and consult a medical healthcare provider immediately.";

function containsSafetyTopic(message: string): boolean {
  const lower = message.toLowerCase();
  return SAFETY_KEYWORDS.some(kw => lower.includes(kw));
}

// ---- Intelligent Response Generator ----

function generateSmartResponse(userMessage: string, context?: AIContext): string {
  if (containsSafetyTopic(userMessage)) {
    return SAFETY_DISCLAIMER;
  }

  const lower = userMessage.toLowerCase();
  const userName = context?.profile?.first_name || '';
  const greeting = userName ? `${userName}, ` : '';

  // Extract explicit time constraint (e.g. "10 min", "10 minutes", "5 min", "15 minutes")
  const timeMatch = lower.match(/(\d+)\s*(min|minute|mins)/);
  const minutes = timeMatch ? parseInt(timeMatch[1], 10) : null;

  // Time-constrained workouts
  if (minutes !== null || lower.includes('short') || lower.includes('quick') || lower.includes('busy') || lower.includes('no time') || lower.includes('little time')) {
    const mins = minutes ?? 15;
    if (mins <= 10) {
      return `${greeting}Here is your optimal 10-Minute Express Circuit (3 Rounds, minimal rest):

1. Air Squats / Goblet Squats — 12 reps
2. Push-ups (or Incline Push-ups) — 10 reps
3. Dumbbell Rows (or Towel Pulls) — 10 reps
4. Plank Hold — 30 seconds

Rest 45 seconds between rounds. This gets your heart rate up, maintains muscle stimulus, and takes under 10 minutes total!`;
    }

    if (mins <= 20) {
      return `${greeting}Here is an effective 15 to 20-Minute Full-Body Workout:

1. Goblet Squats — 3 sets of 10-12 reps
2. Push-ups — 3 sets of 10-12 reps
3. Single-Arm Dumbbell Rows — 3 sets of 10-12 reps per arm
4. Glute Bridges — 3 sets of 15 reps
5. Plank Hold — 3 sets of 30-45 seconds

Keep rest intervals to 60 seconds. You'll stimulate major muscle groups and boost metabolism without exhausting your recovery!`;
    }

    return `${greeting}For a 30-minute session, aim for 3 core compound movements:
- Goblet Squats or Leg Press (3x10)
- Dumbbell Chest Press or Push-ups (3x10)
- One-Arm Rows or Lat Pulldowns (3x10)
Finish with 5 minutes of hip and shoulder mobility. Rest 60-90s between sets.`;
  }

  // Soreness & Joint Health
  if (lower.includes('sore') || lower.includes('joint') || lower.includes('knee') || lower.includes('back') || lower.includes('shoulder') || lower.includes('hurt') || lower.includes('pain')) {
    return `${greeting}For men over 40, joint integrity and recovery are non-negotiable:
1. Mild muscle soreness is normal; sharp joint pain is NOT. If a knee or shoulder aches, swap for joint-friendly variations (e.g., Box Squats instead of Deep Squats, Neutral-Grip Dumbbell Press instead of Barbell Bench).
2. Prioritize a 5-minute dynamic warm-up: arm circles, leg swings, thoracic rotations.
3. Hydrate with electrolytes and ensure 7-8 hours of quality sleep to repair connective tissue.`;
  }

  // Protein & Diet / Nutrition
  if (lower.includes('protein') || lower.includes('eat') || lower.includes('diet') || lower.includes('food') || lower.includes('calori') || lower.includes('nutrition') || lower.includes('meal')) {
    const weight = context?.profile?.weight_kg ? Math.round(context.profile.weight_kg * 2.2) : 180;
    const recommendedProtein = Math.round(weight * 0.8);
    return `${greeting}Nutrition strategy for men 40+:
- Target Protein: Aim for ~${recommendedProtein}g of protein daily (${weight} lbs bodyweight × 0.8g). High quality sources: eggs, chicken breast, lean beef, salmon, Greek yogurt, and whey/plant protein.
- Meal Timing: Distribute protein across 3-4 meals (~30-40g per meal) to maximize muscle protein synthesis.
- Fat Loss: Maintain a modest 300-500 calorie deficit while keeping protein high so you lose fat, not muscle.`;
  }

  // Fat Loss / Weight Loss
  if (lower.includes('fat') || lower.includes('weight') || lower.includes('belly') || lower.includes('gut') || lower.includes('lose') || lower.includes('cutting')) {
    return `${greeting}To shed belly fat while keeping your hard-earned muscle:
1. Calorie Deficit: Eat ~300-500 calories below maintenance.
2. Maintain Strength Training: Keep lifting 3-4 days a week to signal your body to retain muscle.
3. Daily Steps: Target 8,000–10,000 steps per day for low-stress NEAT calorie burn.
4. Sleep: Less than 6 hours spikes cortisol and appetite hormones. Aim for 7-8 hours nightly.`;
  }

  // Muscle Building & Strength
  if (lower.includes('muscle') || lower.includes('strong') || lower.includes('bulk') || lower.includes('hypertrophy') || lower.includes('chest') || lower.includes('arm')) {
    return `${greeting}To build muscle after 40 without risking injury:
1. Progressive Overload: Focus on gradual increases — add 1 rep or 2.5 lbs when all sets hit target reps.
2. Time Under Tension: Control the eccentric (lowering) phase for 2-3 seconds.
3. Focus on Compounds: Squats, deadlift variations, rows, and overhead presses stimulate maximum testosterone & growth hormone response.`;
  }

  // Sleep & Recovery
  if (lower.includes('sleep') || lower.includes('recover') || lower.includes('tired') || lower.includes('fatigu') || lower.includes('rest')) {
    return `${greeting}Recovery is where growth happens!
- Aim for 7 to 8.5 hours of uninterrupted sleep.
- Keep your room cool (65–68°F / 18–20°C) and dark.
- Limit screens 45 minutes before bed to support natural melatonin levels.
- If feeling depleted, take an extra rest day or focus on active recovery like light walking and stretching.`;
  }

  // Equipment & Home Training
  if (lower.includes('equipment') || lower.includes('home') || lower.includes('dumbbell') || lower.includes('band') || lower.includes('gym')) {
    return `${greeting}You can build a world-class physique at home!
- Adjustable Dumbbells + Resistance Bands give you 95% of the benefits of a full commercial gym.
- Focus on Goblet Squats, Dumbbell Romanian Deadlifts, Floor Press, Bent-Over Rows, and Overhead Press.
- Focus on form and execution over sheer weight.`;
  }

  // General Motivational Fallback
  return `${greeting}Great question! For men in midlife, consistency is the ultimate secret. Showing up for 3-4 structured sessions per week, hitting your protein goals, and getting 7-8 hours of sleep will produce incredible transformations. What specific goal are you focusing on today — workout guidance, nutrition, or recovery?`;
}

// ---- System Prompt Builder for Real AI ----

function buildSystemPrompt(context?: AIContext): string {
  let prompt = `You are Fit Coach, a professional fitness and nutrition assistant for Fit For Midlife Men, a premium fitness web app for men aged 40+.

Key Directives:
- Provide practical, evidence-based fitness, workout, and nutrition advice tailored for men aged 40+.
- Emphasize joint-friendly exercise modifications, proper warm-ups, adequate protein intake, and recovery.
- Keep answers structured, encouraging, concise, and easy to read.

Safety Rules:
- NEVER diagnose medical conditions or prescribe medication.
- Recommend consulting a physician for medical concerns or severe injuries.`;

  if (context?.profile) {
    const p = context.profile;
    prompt += `\n\nUser Profile:
- Name: ${p.first_name}
- Age: ${p.age}
- Goal: ${p.goal}
- Level: ${p.fitness_level}
- Training: ${p.training_days_per_week} days/week, ${p.workout_duration_minutes} min sessions
- Equipment: ${p.equipment.join(', ')}`;
  }

  return prompt;
}

// ---- Gemini API Call ----

async function callGemini(messages: ChatMessage[], context?: AIContext): Promise<string> {
  if (!GEMINI_KEY) throw new Error('No Gemini API key configured');

  const systemPrompt = buildSystemPrompt(context);
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const models = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents,
            generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        lastError = new Error(`Gemini API error (${model}): ${response.status}`);
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

// ---- OpenAI API Call ----

async function callOpenAI(messages: ChatMessage[], context?: AIContext): Promise<string> {
  if (!OPENAI_KEY) throw new Error('No OpenAI API key configured');

  const systemPrompt = buildSystemPrompt(context);
  const openaiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: openaiMessages,
      max_tokens: 512,
      temperature: 0.7,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'I could not generate a response.';
}

// ---- Public Send Message ----

export async function sendMessage(
  messages: ChatMessage[],
  context?: AIContext
): Promise<string> {
  const lastMessage = messages[messages.length - 1];
  const userText = lastMessage?.content || '';

  if (containsSafetyTopic(userText)) {
    return SAFETY_DISCLAIMER;
  }

  // Try real API first if configured
  try {
    if (AI_PROVIDER === 'gemini' && GEMINI_KEY) {
      return await callGemini(messages, context);
    }
    if (AI_PROVIDER === 'openai' && OPENAI_KEY) {
      return await callOpenAI(messages, context);
    }
  } catch (err) {
    console.error('[AI] API call error, falling back to smart engine:', err);
  }

  // Simulated latency for natural typing experience
  await new Promise(r => setTimeout(r, 600 + Math.random() * 500));
  return generateSmartResponse(userText, context);
}

export { SAFETY_DISCLAIMER };
