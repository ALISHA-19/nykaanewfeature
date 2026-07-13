import { useState, useRef } from 'react';
import { Sparkles, ArrowRight, Camera, Loader2, Sun, Moon, AlertTriangle, Lightbulb, X, Upload, Scissors, Droplets, MessageCircle, ChevronDown } from 'lucide-react';
import { useBeautyStore } from '@/store/useBeautyStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RoutineStep {
  step: number;
  product: string;
  reason: string;
  suggestion: string;
}

interface BeautyAnalysis {
  skinType: string;
  undertone: string;
  concerns: string[];
  foundationShade: string;
  shadeLabel: string;
  morningRoutine: RoutineStep[];
  nightRoutine: RoutineStep[];
  skinTips: string[];
  hairType: string;
  hairTexture: string;
  hairPorosity: string;
  scalpType: string;
  hairConcerns: string[];
  hairCareRoutine: RoutineStep[];
  hairStylingTips: RoutineStep[];
  hairTips: string[];
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

type Stage = 'idle' | 'goal' | 'upload' | 'analyzing' | 'results';
type ResultSection = 'skin' | 'hair';
type SkinTab = 'morning' | 'night';
type HairTab = 'care' | 'styling';

const AIConsultation = () => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [goal, setGoal] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<BeautyAnalysis | null>(null);
  const [section, setSection] = useState<ResultSection>('skin');
  const [skinTab, setSkinTab] = useState<SkinTab>('morning');
  const [hairTab, setHairTab] = useState<HairTab>('care');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processIntent = useBeautyStore(s => s.processIntent);
  const userName = useBeautyStore(s => s.userProfile.name);

  const handleSubmit = (q: string) => {
    const finalGoal = q.trim() || 'Personalized skin & hair analysis';
    processIntent(finalGoal);
    setGoal(finalGoal);
    setValue('');
    setFocused(false);
    setStage('upload');
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
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const runAnalysis = async () => {
    if (!preview) return;
    setStage('analyzing');
    try {
      const { data, error } = await supabase.functions.invoke('skin-analysis', {
        body: { imageBase64: preview },
      });
      if (error) {
        toast.error('Analysis failed', { description: error.message || 'Please try again.' });
        setStage('upload');
        return;
      }
      if (data?.error) {
        toast.error('Analysis failed', { description: data.error });
        setStage('upload');
        return;
      }
      setAnalysis(data as BeautyAnalysis);
      setStage('results');
    } catch {
      toast.error('Something went wrong');
      setStage('upload');
    }
  };

  const reset = () => {
    setStage('idle');
    setPreview(null);
    setAnalysis(null);
    setGoal('');
    setSection('skin');
  };

  const shadeColor = analysis ? (shadeColors[analysis.foundationShade] || '#D4A574') : '#D4A574';
  const isLoading = stage === 'analyzing';

  return (
    <section id="consultation" className="scroll-mt-20">
      <div className="aura-card p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary-soft blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent-soft blur-3xl opacity-70 pointer-events-none" />

        <div className="relative">
          {/* Header — assistant identity */}
          <div className="flex items-start justify-between gap-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full aura-gradient flex items-center justify-center shadow-md shrink-0 mt-0.5">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">Aura</h3>
                  <span className="aura-badge border-primary/20 bg-primary-soft text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-success ai-thinking-dot" />
                    Online
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">AI Beauty Advisor · Personalized to {userName}</p>
              </div>
            </div>
            {stage !== 'idle' && (
              <button onClick={reset} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Stage: idle — assistant asks */}
          {stage === 'idle' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <p className="text-lg font-serif italic text-foreground leading-snug">
                    "Hi {userName} — tell me your goal, and I'll build a routine just for you."
                  </p>
                  <p className="text-sm text-muted-foreground">
                    I'll analyze a selfie, check every ingredient for your allergies, and design a morning + night routine you'll actually keep.
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 rounded-xl border bg-background px-4 py-3.5 transition-all ${
                  focused ? 'border-primary shadow-glow' : 'border-border'
                }`}
              >
                <MessageCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 200)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit(value)}
                  placeholder="e.g. clear my hormonal acne, glow for my wedding..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
                <button
                  onClick={() => handleSubmit(value)}
                  className="aura-gradient rounded-lg px-4 py-2 text-xs font-semibold text-primary-foreground hover:shadow-glow transition-all flex items-center gap-1.5"
                >
                  Start
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {suggestions.map(s => (
                  <button
                    key={s.label}
                    onMouseDown={() => handleSubmit(s.label)}
                    className="text-xs border border-border rounded-full px-3 py-1.5 bg-background text-foreground hover:border-primary hover:bg-primary-soft transition-all"
                  >
                    <span className="mr-1">{s.icon}</span>{s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stage: upload */}
          {stage === 'upload' && (
            <div className="space-y-4 animate-fade-in">
              <AssistantBubble>
                Got it — your goal is <strong className="text-primary">{goal}</strong>. Share a well-lit selfie and I'll analyze your skin type, undertone, concerns, and even your hair to build the right routine.
              </AssistantBubble>

              <input ref={fileInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleFileChange} />

              {!preview ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-10 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary-soft/40 transition-all cursor-pointer group"
                >
                  <div className="h-14 w-14 rounded-2xl bg-primary-soft flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Camera className="h-7 w-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">Upload a selfie</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Max 5MB · Never stored · Analyzed on-device</p>
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-primary/20 shrink-0">
                    <img src={preview} alt="Your selfie" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-semibold text-foreground">Ready when you are.</p>
                    <div className="flex gap-2">
                      <button onClick={() => setPreview(null)} className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors">
                        Change photo
                      </button>
                      <button
                        onClick={runAnalysis}
                        className="aura-gradient px-5 py-1.5 rounded-lg text-xs font-semibold text-primary-foreground hover:shadow-glow transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="h-3 w-3" />
                        Analyze my skin
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stage: analyzing */}
          {isLoading && (
            <div className="space-y-3 animate-fade-in mt-4">
              <AssistantBubble>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary ai-thinking-dot" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary ai-thinking-dot" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary ai-thinking-dot" />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-primary">Analyzing</span>
                </div>
                <div className="space-y-2">
                  {['Detecting skin type & undertone', 'Reading facial concerns', 'Analyzing hair porosity & texture', 'Matching foundation shade', 'Building your routine'].map((s, i) => (
                    <div key={s} className="flex items-center gap-2 text-xs text-muted-foreground" style={{ animationDelay: `${i * 200}ms` }}>
                      <div className="h-1 w-24 rounded-full shimmer" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </AssistantBubble>
            </div>
          )}

          {/* Stage: results */}
          {stage === 'results' && analysis && (
            <div className="space-y-5 animate-fade-in">
              <AssistantBubble>
                I analyzed your photo. Here's what I found — plus a routine tailored to <strong className="text-primary">{goal}</strong>.
              </AssistantBubble>

              {/* Section toggle */}
              <div className="flex gap-2 border-b border-border">
                {[
                  { key: 'skin', label: 'Skin Analysis', icon: Droplets },
                  { key: 'hair', label: 'Hair Analysis', icon: Scissors },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setSection(t.key as ResultSection)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                      section === t.key
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <t.icon className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                ))}
              </div>

              {section === 'skin' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr,auto] gap-4 items-center">
                    {preview && (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-primary/15 shrink-0">
                        <img src={preview} alt="You" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">I identified</p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="aura-badge border-primary/20 bg-primary-soft text-primary">{analysis.skinType} skin</span>
                        <span className="aura-badge border-info/20 bg-info-soft text-info">{analysis.undertone} undertone</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2">
                      <div className="h-10 w-10 rounded-full ring-2 ring-card shadow-md" style={{ backgroundColor: shadeColor }} />
                      <div>
                        <p className="text-xs font-semibold text-foreground">MAC {analysis.foundationShade}</p>
                        <p className="text-[10px] text-muted-foreground">{analysis.shadeLabel}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-2">I noticed</p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.concerns.map(c => (
                        <span key={c} className="aura-badge border-warning/20 bg-warning-soft text-warning-foreground">
                          <AlertTriangle className="h-3 w-3" />
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">I recommend</p>
                      <div className="flex gap-1 rounded-lg bg-muted p-0.5">
                        <button onClick={() => setSkinTab('morning')} className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${skinTab === 'morning' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                          <Sun className="h-3 w-3" />Morning
                        </button>
                        <button onClick={() => setSkinTab('night')} className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${skinTab === 'night' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                          <Moon className="h-3 w-3" />Night
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {(skinTab === 'morning' ? analysis.morningRoutine : analysis.nightRoutine).map(step => (
                        <RoutineStepRow key={step.step} step={step} />
                      ))}
                    </div>
                  </div>

                  {analysis.skinTips?.length > 0 && (
                    <TipsBlock title="Personal tips from Aura" tips={analysis.skinTips} />
                  )}
                </div>
              )}

              {section === 'hair' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="aura-badge border-primary/20 bg-primary-soft text-primary">{analysis.hairType}</span>
                    <span className="aura-badge border-info/20 bg-info-soft text-info">{analysis.hairTexture} texture</span>
                    <span className="aura-badge border-warning/20 bg-warning-soft text-warning-foreground">{analysis.hairPorosity} porosity</span>
                    <span className="aura-badge border-success/20 bg-success-soft text-success">{analysis.scalpType} scalp</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-2">I noticed</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(analysis.hairConcerns || []).map(c => (
                        <span key={c} className="aura-badge border-warning/20 bg-warning-soft text-warning-foreground">
                          <AlertTriangle className="h-3 w-3" />{c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">I recommend</p>
                      <div className="flex gap-1 rounded-lg bg-muted p-0.5">
                        <button onClick={() => setHairTab('care')} className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${hairTab === 'care' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>Care</button>
                        <button onClick={() => setHairTab('styling')} className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${hairTab === 'styling' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>Styling</button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {(hairTab === 'care' ? (analysis.hairCareRoutine || []) : (analysis.hairStylingTips || [])).map(step => (
                        <RoutineStepRow key={step.step} step={step} />
                      ))}
                    </div>
                  </div>
                  {analysis.hairTips?.length > 0 && (
                    <TipsBlock title="Personal hair tips" tips={analysis.hairTips} />
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button onClick={reset} className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                  New consultation
                </button>
                <button
                  onClick={() => { setStage('upload'); setAnalysis(null); setPreview(null); }}
                  className="flex-1 py-2.5 rounded-xl aura-gradient text-xs font-semibold text-primary-foreground hover:shadow-glow transition-all flex items-center justify-center gap-1.5"
                >
                  <Upload className="h-3 w-3" />
                  Analyze another photo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const AssistantBubble = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3">
    <div className="h-7 w-7 rounded-full aura-gradient flex items-center justify-center shrink-0">
      <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
    </div>
    <div className="flex-1 rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3 text-sm text-foreground leading-relaxed">
      {children}
    </div>
  </div>
);

const RoutineStepRow = ({ step }: { step: RoutineStep }) => (
  <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-3 hover:border-primary/30 hover:shadow-sm transition-all">
    <span className="h-7 w-7 rounded-full bg-primary-soft flex items-center justify-center text-xs text-primary font-semibold shrink-0 mt-0.5">
      {step.step}
    </span>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-foreground">{step.product}</p>
      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.reason}</p>
      <p className="text-xs text-primary font-medium mt-1 flex items-center gap-1">
        <ChevronDown className="h-3 w-3 -rotate-90" />
        {step.suggestion}
      </p>
    </div>
  </div>
);

const TipsBlock = ({ title, tips }: { title: string; tips: string[] }) => (
  <div className="rounded-2xl border border-accent/20 bg-accent-soft/50 p-4 space-y-2">
    <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
      <Lightbulb className="h-3.5 w-3.5 text-accent" />
      {title}
    </p>
    <ul className="space-y-1.5">
      {tips.map((tip, i) => (
        <li key={i} className="text-xs text-foreground/80 pl-4 relative">
          <span className="absolute left-0 top-1.5 h-1 w-1 rounded-full bg-accent" />
          {tip}
        </li>
      ))}
    </ul>
  </div>
);

export default AIConsultation;
