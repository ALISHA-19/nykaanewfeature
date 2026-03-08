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

      if (error) {
        console.error('Edge function error:', error);
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
    } catch (err) {
      console.error('Skin analysis error:', err);
      toast.error('Something went wrong', { description: 'Please try again.' });
    }
    setLoading(false);
  };

  const shadeColor = analysis ? (shadeColors[analysis.foundationShade] || '#D4A574') : '#D4A574';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-card rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Virtual Mirror — AI Skin Analysis
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Upload section */}
          {!analysis && (
            <div className="space-y-4">
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
                  className="w-full h-64 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer group"
                >
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">Upload your selfie</p>
                    <p className="text-xs text-muted-foreground mt-1">Take a photo or choose from gallery · Max 5MB</p>
                  </div>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="relative mx-auto w-48 h-48 rounded-2xl overflow-hidden border-4 border-border">
                    <img src={preview} alt="Your selfie" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => { setPreview(null); setAnalysis(null); }}
                      className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      Change Photo
                    </button>
                    <button
                      onClick={analyzeSkin}
                      disabled={loading}
                      className="nykaa-gradient px-6 py-2 rounded-lg text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          Analyze My Skin
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {loading && (
                <div className="text-center py-4 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p className="text-sm font-medium text-foreground">AI is analyzing your skin...</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Detecting skin type, concerns, undertone & shade match</p>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {analysis && (
            <div className="space-y-6 animate-fade-in">
              {/* Top summary */}
              <div className="flex items-start gap-4">
                {preview && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-border shrink-0">
                    <img src={preview} alt="Your photo" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-foreground">Your Skin Profile</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold">
                      {analysis.skinType} Skin
                    </span>
                    <span className="text-[10px] uppercase tracking-wider bg-info/10 text-info px-2.5 py-1 rounded-full font-bold">
                      {analysis.undertone} Undertone
                    </span>
                  </div>
                </div>
              </div>

              {/* Concerns */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Detected Concerns</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.concerns.map(c => (
                    <span key={c} className="text-xs px-3 py-1.5 rounded-full bg-warning/10 text-warning font-medium flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Foundation shade */}
              <div className="rounded-xl border border-border bg-muted/50 p-4 flex items-center gap-4">
                <div
                  className="h-16 w-16 rounded-full border-4 border-card shadow-md shrink-0"
                  style={{ backgroundColor: shadeColor }}
                />
                <div>
                  <p className="text-sm font-bold text-foreground">Foundation Match: MAC {analysis.foundationShade}</p>
                  <p className="text-xs text-muted-foreground">{analysis.shadeLabel} · {analysis.undertone} undertone</p>
                </div>
              </div>

              {/* Routines */}
              <div>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActiveTab('morning')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                      activeTab === 'morning'
                        ? 'nykaa-gradient text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" /> Morning Routine
                  </button>
                  <button
                    onClick={() => setActiveTab('night')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                      activeTab === 'night'
                        ? 'nykaa-gradient text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5" /> Night Routine
                  </button>
                </div>

                <div className="space-y-3">
                  {(activeTab === 'morning' ? analysis.morningRoutine : analysis.nightRoutine).map(step => (
                    <div key={step.step} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
                      <span className="h-7 w-7 rounded-full nykaa-gradient flex items-center justify-center text-[11px] text-primary-foreground font-bold shrink-0">
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

              {/* Tips */}
              <div className="rounded-xl border border-success/20 bg-success/5 p-4 space-y-2">
                <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-success" /> Personalized Tips
                </p>
                {analysis.tips.map((tip, i) => (
                  <p key={i} className="text-xs text-muted-foreground pl-5">• {tip}</p>
                ))}
              </div>

              {/* Re-analyze */}
              <button
                onClick={() => { setAnalysis(null); setPreview(null); }}
                className="w-full py-3 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Try Another Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualMirror;
