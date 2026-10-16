// src/components/nutrition/AIMealScannerModal.tsx

import { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { analyzeMealPhoto, type MealVisionResult } from '../../lib/mealVision';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface AIMealScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogMeal: (meal: {
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
}

export default function AIMealScannerModal({ isOpen, onClose, onLogMeal }: AIMealScannerModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<MealVisionResult | null>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    setSelectedFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setScanResult(null);
    setIsScanning(true);

    try {
      const result = await analyzeMealPhoto(file);
      setScanResult(result);
      setIsScanning(false);
      toast.success(`🎉 Identified: ${result.dishName}`);
    } catch (err) {
      console.error('[AIMealScannerModal] Scan error:', err);
      setIsScanning(false);
      toast.error('Could not analyze photo. Please try another image.');
    }
  };

  const handleLogAnalyzedMeal = () => {
    if (!scanResult) return;
    onLogMeal({
      meal_type: mealType,
      name: scanResult.dishName,
      calories: scanResult.calories,
      protein: scanResult.protein,
      carbs: scanResult.carbs,
      fat: scanResult.fat,
    });
    toast.success(`Logged ${scanResult.dishName} (${scanResult.calories} kcal)!`);
    onClose();
  };

  const handleResetScan = () => {
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setScanResult(null);
    setIsScanning(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(9, 11, 16, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div className="card card-gold animate-fade-in" style={{ maxWidth: 540, width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: 38, height: 38, background: 'var(--grad-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={20} color="#0F1117" />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>AI Meal Vision Scanner</h3>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Sparkles size={12} color="var(--clr-primary)" /> Instant Macro & Calorie Recognition
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--clr-text-3)', cursor: 'pointer', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Hidden Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])}
        />
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={e => e.target.files?.[0] && handleFileChange(e.target.files[0])}
        />

        {!selectedFile ? (
          /* Step 1: Upload / Camera Options */
          <div>
            <div style={{
              border: '2px dashed var(--clr-border)', borderRadius: 'var(--radius-xl)',
              padding: '2.5rem 1.5rem', textAlign: 'center', background: 'var(--clr-bg-3)',
              marginBottom: '1.5rem', transition: 'border-color var(--transition-fast)',
            }}>
              <div style={{ width: 64, height: 64, background: 'rgba(232,160,32,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Sparkles size={32} color="var(--clr-primary)" />
              </div>
              <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: '0.5rem' }}>
                Snap or Upload Your Meal Photo
              </h4>
              <p style={{ color: 'var(--clr-text-3)', fontSize: 'var(--text-sm)', maxWidth: 360, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                Our AI Vision engine will instantly detect the dish, estimate portion size, and calculate protein, calories, carbs, and fats.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button onClick={() => cameraInputRef.current?.click()}>
                  <Camera size={18} /> Take Photo (Camera)
                </Button>
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  <Upload size={18} /> Choose File
                </Button>
              </div>
            </div>

            <div style={{ background: 'rgba(232,160,32,0.06)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem', border: '1px solid rgba(232,160,32,0.2)', fontSize: 'var(--text-xs)', color: 'var(--clr-text-2)', lineHeight: 1.5 }}>
              💡 <strong>Tip for best accuracy:</strong> Ensure good lighting and hold your camera directly above your plate so all food items are visible.
            </div>
          </div>
        ) : (
          /* Step 2: Scanning & Prediction Screen */
          <div>
            {/* Image Preview */}
            <div style={{ position: 'relative', height: 200, borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid var(--clr-border)' }}>
              {imagePreviewUrl && (
                <img src={imagePreviewUrl} alt="Scanned meal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <button
                onClick={handleResetScan}
                style={{
                  position: 'absolute', top: 10, right: 10, background: 'rgba(15,17,23,0.85)',
                  border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-full)',
                  color: 'var(--clr-text)', padding: '0.375rem 0.75rem', fontSize: 'var(--text-xs)',
                  display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer',
                }}
              >
                <RefreshCw size={12} /> Change Photo
              </button>
            </div>

            {/* Scanning Indicator */}
            {isScanning ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div className="animate-spin" style={{ width: 36, height: 36, border: '3px solid rgba(232,160,32,0.2)', borderTopColor: 'var(--clr-primary)', borderRadius: '50%', margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: '0.25rem' }}>AI Computer Vision Scanning...</h4>
                <p style={{ color: 'var(--clr-text-3)', fontSize: 'var(--text-xs)' }}>
                  Analyzing food items, portion size & nutrient density...
                </p>
              </div>
            ) : scanResult && (
              /* Prediction Result Card */
              <div>
                <div style={{ background: 'var(--clr-bg-3)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.25rem', border: '1px solid var(--clr-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Identified Dish
                      </div>
                      <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--clr-text)' }}>
                        {scanResult.dishName}
                      </h4>
                    </div>
                    <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={12} /> {Math.round(scanResult.confidenceScore * 100)}% Match
                    </span>
                  </div>

                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)', marginBottom: '1rem', lineHeight: 1.5 }}>
                    <strong>Portion:</strong> {scanResult.portionEstimate} <br />
                    <strong>Ingredients:</strong> {scanResult.ingredientBreakdown}
                  </p>

                  {/* Predicted Macros Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                    <div style={{ background: 'var(--clr-bg-4)', padding: '0.625rem 0.25rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>Calories</div>
                      <div style={{ fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--clr-primary)' }}>{scanResult.calories}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--clr-text-3)' }}>kcal</div>
                    </div>
                    <div style={{ background: 'var(--clr-bg-4)', padding: '0.625rem 0.25rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>Protein</div>
                      <div style={{ fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--clr-info)' }}>{scanResult.protein}g</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--clr-text-3)' }}>muscle target</div>
                    </div>
                    <div style={{ background: 'var(--clr-bg-4)', padding: '0.625rem 0.25rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>Carbs</div>
                      <div style={{ fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--clr-warning)' }}>{scanResult.carbs}g</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--clr-text-3)' }}>energy</div>
                    </div>
                    <div style={{ background: 'var(--clr-bg-4)', padding: '0.625rem 0.25rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-3)' }}>Fat</div>
                      <div style={{ fontSize: 'var(--text-base)', fontWeight: 900, color: 'var(--clr-danger)' }}>{scanResult.fat}g</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--clr-text-3)' }}>healthy fats</div>
                    </div>
                  </div>
                </div>

                {/* Meal Type Selection */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Log To Meal Category</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                    {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setMealType(type)}
                        style={{
                          padding: '0.5rem', borderRadius: 'var(--radius-md)', border: mealType === type ? '2px solid var(--clr-primary)' : '1px solid var(--clr-border)',
                          background: mealType === type ? 'rgba(232,160,32,0.12)' : 'var(--clr-bg-3)',
                          color: mealType === type ? 'var(--clr-primary)' : 'var(--clr-text-2)',
                          textTransform: 'capitalize', fontSize: 'var(--text-xs)', fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Log Meal Button */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Button variant="secondary" onClick={handleResetScan} block>
                    Scan Another
                  </Button>
                  <Button block onClick={handleLogAnalyzedMeal} id="confirm-ai-meal">
                    <CheckCircle2 size={18} /> Confirm & Log Meal ({scanResult.calories} kcal)
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
