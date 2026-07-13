import { Sparkles, ArrowRight, Camera, ShieldCheck, RefreshCw, Brain } from 'lucide-react';

interface AuraHeroProps {
  userName: string;
  onStart: () => void;
}

const capabilities = [
  { icon: Brain, label: 'Understands your skin', color: 'text-primary' },
  { icon: Sparkles, label: 'Recommends personalized routines', color: 'text-accent' },
  { icon: ShieldCheck, label: 'Prevents unsafe purchases', color: 'text-success' },
  { icon: RefreshCw, label: 'Manages replenishment', color: 'text-info' },
];

const AuraHero = ({ userName, onStart }: AuraHeroProps) => {
  return (
    <section className="relative overflow-hidden">
      {/* Mesh background */}
      <div className="absolute inset-0 aura-mesh opacity-80 pointer-events-none" />

      <div className="container relative pt-14 pb-20 sm:pt-24 sm:pb-28">
        {/* Announcement pill */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span>Aura AI v1.0 — Now analyzing 12,000+ ingredients in real time</span>
          </div>
        </div>

        {/* Headline */}
        <div className="max-w-3xl mx-auto text-center space-y-6 animate-slide-up">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-balance">
            Meet <span className="italic gradient-text">Aura</span>,<br className="hidden sm:block" />
            your personal AI<br className="hidden sm:block" />
            <span className="italic">beauty advisor</span>.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed text-balance">
            An AI employee that understands your skin, curates routines proven to work for you, prevents unsafe purchases, and manages replenishment — so you never think about beauty logistics again.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-2 aura-gradient text-primary-foreground rounded-xl px-6 py-3.5 text-sm font-semibold shadow-lg hover:shadow-glow transition-all"
            >
              <Camera className="h-4 w-4" />
              Start my consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border rounded-xl px-5 py-3.5 hover:bg-card hover:shadow-sm transition-all bg-card/60"
            >
              View {userName}'s dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Capability grid */}
        <div className="mt-14 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto animate-fade-in">
          {capabilities.map((cap, i) => (
            <div
              key={cap.label}
              className="aura-card p-4 sm:p-5 flex items-start gap-3 hover:-translate-y-0.5 transition-transform"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`h-9 w-9 rounded-lg bg-primary-soft flex items-center justify-center shrink-0 ${cap.color}`}>
                <cap.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug">{cap.label}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 font-mono uppercase tracking-wider">Aura AI</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-widest font-mono text-muted-foreground/70">
          <span>Gemini 2.5 Vision</span>
          <span>·</span>
          <span>39 Products Analyzed</span>
          <span>·</span>
          <span>Ingredient Safety Layer</span>
          <span>·</span>
          <span>Autonomous Replenishment</span>
        </div>
      </div>
    </section>
  );
};

export default AuraHero;
