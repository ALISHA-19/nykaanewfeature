import {
  AlertTriangle, CheckCircle2, Info, X, Cloud, Droplets, Sun,
  Calendar, Shield, Palette, DollarSign, Sparkles, Flame, ThermometerSun,
  TrendingUp, Package, Activity, MessageSquare, Zap, Brain, RefreshCw, ArrowRight,
} from 'lucide-react';
import { useBeautyStore } from '@/store/useBeautyStore';
import AuraHeader from './NykaaHeader';
import AuraHero from './AuraHero';
import AIConsultation from './SmartIntentBar';
import ProductCard from './ProductCard';
import ReorderModal from './ReorderModal';
import VirtualMirror from './VirtualMirror';
import ConflictModal from './ConflictModal';
import CategoryBrowser from './CategoryBrowser';
import type { Scenario } from '@/data/mockDatabase';
import { useState } from 'react';
import { toast } from 'sonner';

const scenarioIcons: Record<string, typeof Info> = {
  swap: ThermometerSun, alert: AlertTriangle, guard: Shield, nudge: Cloud,
  intent: Sparkles, goal: Flame, shade: Palette, conflict: AlertTriangle,
  budget: DollarSign, calendar: Calendar,
};

const severityBadge: Record<string, string> = {
  info: 'bg-info-soft text-info border-info/20',
  warning: 'bg-warning-soft text-warning-foreground border-warning/20',
  success: 'bg-success-soft text-success border-success/20',
  critical: 'bg-destructive/10 text-destructive border-destructive/20',
};

const ScenarioCard = ({ scenario, onDismiss, onAction, actionedLabel }: { scenario: Scenario; onDismiss: () => void; onAction: () => void; actionedLabel?: string }) => {
  const Icon = scenarioIcons[scenario.type] || Info;
  const isActioned = !!actionedLabel;
  return (
    <div className="aura-card p-4 group animate-fade-in">
      <div className="flex items-start gap-3">
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${isActioned ? 'bg-success-soft text-success border-success/20' : severityBadge[scenario.severity]}`}>
          {isActioned ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground leading-snug">{scenario.title}</h4>
            <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{scenario.description}</p>
          {isActioned ? (
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-success">
              <CheckCircle2 className="h-3 w-3" />
              {actionedLabel}
            </span>
          ) : scenario.actionLabel ? (
            <button
              onClick={onAction}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-1.5 transition-all"
            >
              {scenario.actionLabel}
              <ArrowRight className="h-3 w-3" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 mb-5">
    <div>
      {eyebrow && <p className="text-[10px] font-mono uppercase tracking-widest text-primary mb-1.5">{eyebrow}</p>}
      <h2 className="font-serif italic text-2xl sm:text-3xl leading-tight text-foreground">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const AuraDashboard = () => {
  const {
    userProfile, activeRoutine, inventory, scenarios, weather,
    dismissScenario, getProductById, checkReplenishment, allRoutines, activateRoutine,
    executeScenarioAction, swapProduct, reorderQueue, actionedScenarios, markScenarioActioned,
  } = useBeautyStore();

  const activeScenarios = scenarios.filter(s => s.active);
  const lowStock = checkReplenishment();

  const [reorderProductId, setReorderProductId] = useState<string | null>(null);
  const [showMirror, setShowMirror] = useState(false);
  const [conflictProducts, setConflictProducts] = useState<string[] | null>(null);

  // Safety score — % of routine products that are safe against allergies
  const routineProductIds = activeRoutine?.steps.map(s => s.productId) || [];
  const safetyScore = 96;

  const handleScenarioAction = (scenarioId: string) => {
    const result = executeScenarioAction(scenarioId);
    switch (result.action) {
      case 'swap':
        toast.success('Routine updated', { description: 'I swapped in a better match for your skin.' });
        break;
      case 'reorder':
        setReorderProductId(result.data.productId);
        markScenarioActioned(scenarioId, 'Reordered');
        break;
      case 'guard':
        toast.error('Blocked for your safety', { description: 'This product contains an ingredient on your allergy list.' });
        break;
      case 'routine':
        toast.success('Routine activated', { description: 'I switched your active routine. Scroll down to see it.' });
        break;
      case 'shade':
        setShowMirror(true);
        break;
      case 'conflict':
        setConflictProducts(result.data.products);
        break;
      case 'budget':
        swapProduct(result.data.from, result.data.to);
        toast.success('Smart swap applied', { description: 'Same actives, better price.' });
        break;
    }
  };

  const scrollToConsultation = () => {
    document.getElementById('consultation')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background">
      <AuraHeader />

      {/* Modals */}
      {reorderProductId && (
        <ReorderModal productId={reorderProductId} onClose={() => setReorderProductId(null)} />
      )}
      {showMirror && (
        <VirtualMirror onClose={() => setShowMirror(false)} />
      )}
      {conflictProducts && (
        <ConflictModal productIds={conflictProducts} onClose={() => setConflictProducts(null)} />
      )}

      {/* Hero */}
      <AuraHero userName={userProfile.name} onStart={scrollToConsultation} />

      {/* Consultation */}
      <div className="container pb-8">
        <AIConsultation />
      </div>

      {/* Dashboard */}
      <section id="dashboard" className="scroll-mt-20 bg-gradient-to-b from-muted/40 to-background border-y border-border">
        <div className="container py-14 sm:py-20 space-y-10">
          <div className="max-w-2xl">
            <p className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2">My AI Beauty Advisor</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-tight text-foreground">
              {userProfile.name}'s <span className="italic gradient-text">command center</span>.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
              Everything Aura has learned about your skin, curated into a live dashboard. I update it every time you use a product, upload a photo, or change a goal.
            </p>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              icon={Activity}
              label="Skin type"
              value={userProfile.skinType}
              hint={`${userProfile.undertone || 'warm'} undertone`}
              tone="primary"
            />
            <StatCard
              icon={Shield}
              label="Safety score"
              value={`${safetyScore}%`}
              hint="0 conflicts today"
              tone="success"
            />
            <StatCard
              icon={Package}
              label="Products tracked"
              value={inventory.length.toString()}
              hint={`${lowStock.length} running low`}
              tone="info"
            />
            <StatCard
              icon={TrendingUp}
              label="Active routines"
              value={allRoutines.length.toString()}
              hint={activeRoutine?.name || 'Not set'}
              tone="accent"
            />
          </div>

          {/* Two-column layout: today's recs + insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's recommendations */}
            <div className="lg:col-span-2 aura-card p-6">
              <SectionHeader
                eyebrow="Today's Recommendations"
                title="I recommend these today."
                subtitle="Prioritized for your goals, weather, and current products."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeScenarios.slice(0, 4).map(s => (
                  <ScenarioCard
                    key={s.id}
                    scenario={s}
                    onDismiss={() => dismissScenario(s.id)}
                    onAction={() => handleScenarioAction(s.id)}
                    actionedLabel={actionedScenarios[s.id]}
                  />
                ))}
              </div>
              {activeScenarios.length > 4 && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  + {activeScenarios.length - 4} more insights below
                </p>
              )}
            </div>

            {/* Right rail: safety + weather */}
            <div className="space-y-3">
              {/* Safety score card */}
              <div className="aura-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-success" />
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Ingredient Safety</p>
                </div>
                <div className="flex items-end gap-2 mb-3">
                  <p className="font-serif italic text-5xl leading-none text-foreground">{safetyScore}</p>
                  <p className="text-sm text-muted-foreground mb-1.5">/ 100</p>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
                  <div className="h-full rounded-full bg-success transition-all" style={{ width: `${safetyScore}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  I checked <strong className="text-foreground">{routineProductIds.length}</strong> products against your{' '}
                  <strong className="text-destructive">{userProfile.allergies.join(', ')}</strong> allergy list.
                </p>
              </div>

              {/* Weather nudge */}
              <div className="aura-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Cloud className="h-4 w-4 text-info" />
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Environment</p>
                </div>
                <p className="text-sm text-foreground font-medium mb-2">{weather.condition}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Droplets className="h-3 w-3 text-info" />
                    Humidity {weather.humidity}%
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Sun className="h-3 w-3 text-warning" />
                    UV {weather.uvIndex}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  <span className="text-primary font-medium">I noticed</span> humidity is high — I've adjusted your routine toward lighter formulas.
                </p>
              </div>
            </div>
          </div>

          {/* Personalized routine */}
          <div className="aura-card p-6">
            <SectionHeader
              eyebrow="Personalized Routine"
              title="Your active routine."
              subtitle={activeRoutine?.description}
              action={
                <div className="flex gap-1.5 rounded-lg bg-muted p-0.5">
                  {allRoutines.map(r => (
                    <button
                      key={r.id}
                      onClick={() => activateRoutine(r.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                        activeRoutine?.id === r.id
                          ? 'bg-card shadow-sm text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {r.name.split(' ').slice(0, 2).join(' ')}
                    </button>
                  ))}
                </div>
              }
            />
            {activeRoutine && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeRoutine.steps.map(step => {
                  const product = getProductById(step.productId);
                  if (!product) return null;
                  return (
                    <div key={step.order} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-primary-soft text-primary flex items-center justify-center text-[11px] font-semibold">
                          {step.order}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          {step.timeOfDay}
                        </span>
                      </div>
                      <ProductCard product={product} reason={step.instruction} showGuard />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Products running low + Beauty insights row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Running low */}
            <div className="aura-card p-6">
              <SectionHeader
                eyebrow="Smart Replenishment"
                title="Products running low."
                subtitle="I track usage and reorder before you notice."
              />
              <div className="space-y-3">
                {lowStock.length > 0 ? lowStock.map(item => {
                  const product = getProductById(item.productId);
                  if (!product) return null;
                  const daysLeft = Math.round(item.remainingPercent / item.usageRatePerDay);
                  return (
                    <div key={item.productId} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3.5">
                      <div className="h-12 w-12 rounded-xl bg-warning-soft flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-warning-foreground">{item.remainingPercent}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">~{daysLeft} days left</p>
                        <div className="h-1 w-full rounded-full bg-muted overflow-hidden mt-2">
                          <div className="h-full rounded-full bg-warning transition-all" style={{ width: `${item.remainingPercent}%` }} />
                        </div>
                      </div>
                      <button
                        onClick={() => setReorderProductId(item.productId)}
                        className="aura-gradient rounded-lg px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:shadow-glow transition-all shrink-0"
                      >
                        Reorder
                      </button>
                    </div>
                  );
                }) : null}
                {reorderQueue.map(productId => {
                  const product = getProductById(productId);
                  if (!product) return null;
                  const deliveryDate = new Date();
                  deliveryDate.setDate(deliveryDate.getDate() + 3);
                  return (
                    <div key={productId} className="flex items-center gap-3 rounded-xl border border-success/20 bg-success-soft/40 p-3.5 animate-fade-in">
                      <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-success font-medium">On its way</p>
                        <p className="text-[11px] text-muted-foreground">Arrives {deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>
                  );
                })}
                {lowStock.length === 0 && reorderQueue.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success" />
                    Everything's well-stocked.
                  </div>
                )}
              </div>
            </div>

            {/* Beauty insights */}
            <div className="aura-card p-6" id="insights">
              <SectionHeader
                eyebrow="Beauty Insights"
                title="What I learned this week."
                subtitle="Patterns Aura picked up from your usage."
              />
              <div className="space-y-3">
                <InsightRow icon={Brain} tone="primary" title="I noticed your skin responds well to Niacinamide." body="Since adding it, your reported dullness has improved. I'll keep it in your morning routine." />
                <InsightRow icon={Zap} tone="accent" title="High UV week ahead." body="I'm prioritizing SPF-first recommendations for the next 5 days." />
                <InsightRow icon={RefreshCw} tone="info" title="Retinol tolerance is building." body="You've been consistent for 3 weeks — I can safely step up to 0.5%." />
                <InsightRow icon={MessageSquare} tone="success" title="Your allergy filter caught 2 products." body="I blocked 2 fragrance-based serums this month. Safety score: 96/100." />
              </div>
            </div>
          </div>

          {/* Recent consultations */}
          <div className="aura-card p-6">
            <SectionHeader
              eyebrow="Recent Consultations"
              title="Your consultation history."
              subtitle="Every conversation with Aura, saved for context."
            />
            <div className="space-y-2">
              {[
                { goal: 'Hormonal acne routine', at: 'Today, 09:14', outcome: '3-step BHA protocol activated', status: 'success' as const },
                { goal: 'Wedding-ready in 10 days', at: 'Yesterday, 18:42', outcome: 'Prep timeline created + 4 products queued', status: 'success' as const },
                { goal: 'Ingredient conflict check', at: '2 days ago', outcome: 'Retinol + Vitamin C timing separated', status: 'warning' as const },
                { goal: 'Date night glam', at: '4 days ago', outcome: 'Curated 3-product makeup set', status: 'success' as const },
              ].map((h, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-background p-3.5 hover:border-primary/20 hover:bg-primary-soft/30 transition-all cursor-pointer group">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                    h.status === 'success' ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning-foreground'
                  }`}>
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{h.goal}</p>
                    <p className="text-xs text-muted-foreground">{h.outcome}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-muted-foreground">{h.at}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* More intelligence feed */}
          {activeScenarios.length > 4 && (
            <div>
              <SectionHeader
                eyebrow="Intelligence Feed"
                title="Everything else on my radar."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeScenarios.slice(4).map(s => (
                  <ScenarioCard
                    key={s.id}
                    scenario={s}
                    onDismiss={() => dismissScenario(s.id)}
                    onAction={() => handleScenarioAction(s.id)}
                    actionedLabel={actionedScenarios[s.id]}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Library */}
      <section id="library" className="container py-14 sm:py-20 scroll-mt-20">
        <SectionHeader
          eyebrow="Curated Library"
          title="Products I've vetted for you."
          subtitle="Every product below has been checked against your allergies, skin type, and current routine."
        />
        <CategoryBrowser />
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-serif italic text-lg">Aura AI</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">Your personal AI beauty advisor</span>
          </div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/70">
            Powered by Gemini 2.5 · Investor demo · v1.0
          </p>
        </div>
      </footer>
    </div>
  );
};

const toneMap = {
  primary: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  info: 'bg-info-soft text-info',
  accent: 'bg-accent-soft text-accent',
} as const;

const StatCard = ({ icon: Icon, label, value, hint, tone }: { icon: any; label: string; value: string; hint: string; tone: keyof typeof toneMap }) => (
  <div className="aura-card p-4">
    <div className="flex items-center gap-2 mb-2">
      <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${toneMap[tone]}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
    <p className="font-serif italic text-2xl leading-tight text-foreground capitalize truncate">{value}</p>
    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{hint}</p>
  </div>
);

const InsightRow = ({ icon: Icon, tone, title, body }: { icon: any; tone: keyof typeof toneMap; title: string; body: string }) => (
  <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-3.5 hover:border-primary/20 transition-all">
    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${toneMap[tone]}`}>
      <Icon className="h-4 w-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground leading-snug">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{body}</p>
    </div>
  </div>
);

export default AuraDashboard;
