import { useState, useRef } from 'react';
import { Sparkles, ArrowRight, Zap, Camera, Loader2, Sun, Moon, AlertTriangle, Lightbulb, X, Upload } from 'lucide-react';
import { useBeautyStore } from '@/store/useBeautyStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RoutineStep {
  step: number;
  product: string;
  reason: string;
  suggestion: string;
}

interface SkinAnalysis {
  skinType: string;
  undertone: string;
  concerns: string[];
  foundationShade: string;
  shadeLabel: string;
  morningRoutine: RoutineStep[];
  nightRoutine: RoutineStep[];
  tips: string[];
}

const shadeColors: Record<string, string> = {
  NC15: '#F5D6BA', NC20: '#F0CCA8', NC25: '#E8C4A0', NC30: '#DDB88C',
  NC35: '#D4A574', NC37: '#CCA06E', NC40: '#C49560', NC42: '#C08E5E',
  NC44: '#B8854E', NC45: '#B07E48', NC50: '#A06B3C', NC55: '#8E5A2C',
  NW13: '#F2D4C0', NW15: '#EED0B8', NW20: '#E4C0A4', NW25: '#D8B496',
  NW30: '#CCA684', NW33: '#C49E7C', NW35: '#BC9674', NW40: '#AC8464',
  NW43: '#A47C5C', NW45: '#9C7454', NW50: '#886240', NW55: '#744E30',
};

const suggestions = [
  { label: 'Fix my dull skin', icon: '✨' },
  { label: 'Prep me for date night', icon: '💄' },
  { label: 'Help with hormonal acne', icon: '🧴' },
  { label: 'Winter hydration routine', icon: '❄️' },
  { label: 'Wedding-ready in 10 days', icon: '💍' },
];

const SmartIntentBar = () => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [goal, setGoal] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'morning' | 'night'>('morning');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processIntent = useBeautyStore(s => s.processIntent);

  const handleSubmit = (q: string) => {
    if (!q.trim()) return;
    processIntent(q);
    setGoal(q);
    setValue('');
    setFocused(false);
    setShowUpload(true);
    setAnalysis(null);
    setPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large', { description: 'Please upload under 5MB.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeSkin = async () => {
    if (!preview) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('skin-analysis', {
        body: { imageBase64: preview },
      });
      if (error) {
        toast.error('Analysis failed', { description: error.message || 'Please try again.' });
        setLoading(false);
        return;
      }
      if (data?.error) {
        toast.error('Analysis failed', { description: data.error });
        setLoading(false);
        return;
      }
      setAnalysis(data as SkinAnalysis);
    } catch {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  const reset = () => {
    setShowUpload(false);
    setPreview(null);
    setAnalysis(null);
    setGoal('');
    setLoading(false);
  };

  const shadeColor = analysis ? (shadeColors[analysis.foundationShade] || '#D4A574') : '#D4A574';

  return (
    <div className="relative">
      <div className="rounded-xl bg-secondary border border-primary/20 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">What's your beauty goal?</h3>
            <span className="text-[10px] font-semibold text-primary-foreground bg-primary px-2 py-0.5 rounded-full ml-1">AI POWERED</span>
          </div>
          {(showUpload || analysis) && (
            <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Input bar — shown when not in upload/results mode */}
        {!showUpload && !analysis && (
          <>
            <div className={`flex items-center gap-2 rounded-lg border bg-card px-4 py-3 transition-all ${focused ? 'border-primary shadow-md shadow-primary/10' : 'border-border'}`}>
              <Zap className="h-4 w-4 text-primary shrink-0" />
              <input
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(value)}
                placeholder="Type your goal — e.g. 'clear acne', 'glow for my wedding'..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => handleSubmit(value)}
                className="nykaa-gradient rounded-lg px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-1"
              >
                Go <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestions.map(s => (
                <button
                  key={s.label}
                  onMouseDown={() => handleSubmit(s.label)}
                  className="text-xs border border-border rounded-full px-3 py-1.5 bg-card text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Upload phase */}
        {showUpload && !analysis && (
          <div className="space-y-4 animate-fade-in">
            <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-2.5 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
              <p className="text-xs text-foreground">
                Goal: <span className="font-semibold text-primary">{goal}</span> — Upload a selfie so our AI can analyze your skin and build a personalized routine.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={handleFileChange}
            />

            {!preview ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-10 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer group"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">Upload your selfie</p>
                <p className="text-[11px] text-muted-foreground">Take a photo or choose from gallery · Max 5MB</p>
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-border shrink-0">
                  <img src={preview} alt="Your selfie" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-semibold text-foreground">Photo ready!</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreview(null)}
                      className="px-3 py-1.5 rounded-lg border border-border text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      Change
                    </button>
                    <button
                      onClick={analyzeSkin}
                      disabled={loading}
                      className="nykaa-gradient px-5 py-1.5 rounded-lg text-[11px] font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {loading ? (
                        <><Loader2 className="h-3 w-3 animate-spin" /> Analyzing...</>
                      ) : (
                        <><Sparkles className="h-3 w-3" /> Analyze My Skin</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-3 rounded-lg bg-muted px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground">AI is analyzing your skin...</p>
                  <p className="text-[11px] text-muted-foreground">Detecting skin type, undertone, concerns & shade match</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div className="space-y-5 animate-fade-in">
            {/* Goal reminder */}
            <div className="rounded-lg bg-success/10 border border-success/20 px-4 py-2.5 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-success shrink-0" />
              <p className="text-xs text-foreground">
                Analysis complete for: <span className="font-semibold text-success">{goal}</span>
              </p>
            </div>

            {/* Summary row */}
            <div className="flex items-start gap-4">
              {preview && (
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-border shrink-0">
                  <img src={preview} alt="Your photo" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="text-sm font-bold text-foreground">Your Skin Profile</h4>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    {analysis.skinType} Skin
                  </span>
                  <span className="text-[10px] uppercase tracking-wider bg-info/10 text-info px-2 py-0.5 rounded-full font-bold">
                    {analysis.undertone} Undertone
                  </span>
                </div>
              </div>
              {/* Foundation swatch */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div
                  className="h-10 w-10 rounded-full border-2 border-card shadow-md"
                  style={{ backgroundColor: shadeColor }}
                />
                <div>
                  <p className="text-xs font-bold text-foreground">MAC {analysis.foundationShade}</p>
                  <p className="text-[10px] text-muted-foreground">{analysis.shadeLabel}</p>
                </div>
              </div>
            </div>

            {/* Concerns */}
            <div className="flex flex-wrap gap-1.5">
              {analysis.concerns.map(c => (
                <span key={c} className="text-[11px] px-2.5 py-1 rounded-full bg-warning/10 text-warning font-medium flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {c}
                </span>
              ))}
            </div>

            {/* Routines */}
            <div>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setActiveTab('morning')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors ${
                    activeTab === 'morning'
                      ? 'nykaa-gradient text-primary-foreground'
                      : 'bg-card border border-border text-foreground hover:border-primary'
                  }`}
                >
                  <Sun className="h-3 w-3" /> Morning
                </button>
                <button
                  onClick={() => setActiveTab('night')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors ${
                    activeTab === 'night'
                      ? 'nykaa-gradient text-primary-foreground'
                      : 'bg-card border border-border text-foreground hover:border-primary'
                  }`}
                >
                  <Moon className="h-3 w-3" /> Night
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(activeTab === 'morning' ? analysis.morningRoutine : analysis.nightRoutine).map(step => (
                  <div key={step.step} className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3 hover:shadow-sm transition-shadow">
                    <span className="h-6 w-6 rounded-full nykaa-gradient flex items-center justify-center text-[10px] text-primary-foreground font-bold shrink-0 mt-0.5">
                      {step.step}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground">{step.product}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{step.reason}</p>
                      <p className="text-[11px] text-primary font-medium mt-0.5">→ {step.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-lg border border-success/20 bg-success/5 p-3 space-y-1.5">
              <p className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-success" /> Personalized Tips
              </p>
              {analysis.tips.map((tip, i) => (
                <p key={i} className="text-[11px] text-muted-foreground pl-5">• {tip}</p>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={reset}
                className="flex-1 py-2.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Try Another Goal
              </button>
              <button
                onClick={() => { setShowUpload(true); setAnalysis(null); setPreview(null); }}
                className="flex-1 py-2.5 rounded-lg nykaa-gradient text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
              >
                <Upload className="h-3 w-3" /> New Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartIntentBar;
