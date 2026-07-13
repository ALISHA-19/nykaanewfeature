import { X, Palette, CheckCircle2, Upload, Camera, Sun, Moon, Sparkles, Loader2, AlertTriangle, Lightbulb } from 'lucide-react';
import { useBeautyStore } from '@/store/useBeautyStore';
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VirtualMirrorProps {
  onClose: () => void;
}

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

const VirtualMirror = ({ onClose }: VirtualMirrorProps) => {
  const { userProfile } = useBeautyStore();
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'morning' | 'night'>('morning');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large', { description: 'Please upload an image under 5MB.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const analyzeSkin = async () => {
    if (!preview) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('skin-analysis', {
        body: { imageBase64: preview },
      });
      if (error || data?.error) {
        toast.error('Analysis failed', { description: (error?.message || data?.error) || 'Please try again.' });
        setLoading(false);
        return;
      }
      setAnalysis(data as SkinAnalysis);
    } catch {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  const shadeColor = analysis ? (shadeColors[analysis.foundationShade] || '#D4A574') : '#D4A574';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-md animate-fade-in p-4" onClick={onClose}>
      <div
        className="bg-card rounded-3xl shadow-lg w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col border border-border"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg aura-gradient flex items-center justify-center">
              <Palette className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">AI Skin Consultation</h3>
              <p className="text-[11px] text-muted-foreground">Aura is reading your photo</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {!analysis && (
            <div className="space-y-4">
              <input ref={fileInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleFileChange} />

              {!preview ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-56 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary-soft/40 transition-all cursor-pointer group"
                >
                  <div className="h-14 w-14 rounded-2xl bg-primary-soft flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Camera className="h-7 w-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">Upload a selfie for me</p>
                    <p className="text-xs text-muted-foreground mt-0.5">I'll analyze skin type, undertone, and shade · Max 5MB</p>
                  </div>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="relative mx-auto w-40 h-40 rounded-3xl overflow-hidden ring-2 ring-primary/20">
                    <img src={preview} alt="Your selfie" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => { setPreview(null); setAnalysis(null); }}
                      className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      Change photo
                    </button>
                    <button
                      onClick={analyzeSkin}
                      disabled={loading}
                      className="aura-gradient px-5 py-2 rounded-xl text-xs font-semibold text-primary-foreground hover:shadow-glow transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing…</> : <><Sparkles className="h-3.5 w-3.5" /> Start analysis</>}
                    </button>
                  </div>
                </div>
              )}

              {loading && (
                <div className="text-center py-2 space-y-2">
                  <div className="flex items-center justify-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary ai-thinking-dot" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary ai-thinking-dot" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary ai-thinking-dot" />
                    <span className="text-xs font-mono uppercase tracking-widest text-primary ml-2">Analyzing</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {analysis && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start gap-4">
                {preview && (
                  <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-primary/15 shrink-0">
                    <img src={preview} alt="Your photo" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">I identified</p>
                  <h4 className="font-serif italic text-2xl text-foreground leading-tight">Your skin profile</h4>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="aura-badge border-primary/20 bg-primary-soft text-primary">{analysis.skinType} skin</span>
                    <span className="aura-badge border-info/20 bg-info-soft text-info">{analysis.undertone} undertone</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">I noticed</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.concerns.map(c => (
                    <span key={c} className="aura-badge border-warning/20 bg-warning-soft text-warning-foreground">
                      <AlertTriangle className="h-3 w-3" /> {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/40 p-4 flex items-center gap-4">
                <div
                  className="h-14 w-14 rounded-full ring-4 ring-card shadow-md shrink-0"
                  style={{ backgroundColor: shadeColor }}
                />
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">I match you to</p>
                  <p className="text-sm font-semibold text-foreground">MAC {analysis.foundationShade}</p>
                  <p className="text-xs text-muted-foreground">{analysis.shadeLabel} · {analysis.undertone}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">I recommend</p>
                  <div className="flex gap-1 rounded-lg bg-muted p-0.5">
                    <button
                      onClick={() => setActiveTab('morning')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        activeTab === 'morning' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      <Sun className="h-3 w-3" /> Morning
                    </button>
                    <button
                      onClick={() => setActiveTab('night')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        activeTab === 'night' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      <Moon className="h-3 w-3" /> Night
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {(activeTab === 'morning' ? analysis.morningRoutine : analysis.nightRoutine).map(step => (
                    <div key={step.step} className="flex items-start gap-3 rounded-xl border border-border bg-background p-3.5">
                      <span className="h-7 w-7 rounded-full bg-primary-soft flex items-center justify-center text-xs text-primary font-semibold shrink-0 mt-0.5">
                        {step.step}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{step.product}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.reason}</p>
                        <p className="text-xs text-primary font-medium mt-1">→ {step.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-accent/20 bg-accent-soft/50 p-4 space-y-2">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-accent" /> Personal tips from Aura
                </p>
                {analysis.tips.map((tip, i) => (
                  <p key={i} className="text-xs text-foreground/80 pl-5 relative">
                    <span className="absolute left-0 top-1.5 h-1 w-1 rounded-full bg-accent" />
                    {tip}
                  </p>
                ))}
              </div>

              <button
                onClick={() => { setAnalysis(null); setPreview(null); }}
                className="w-full py-2.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Analyze another photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualMirror;
