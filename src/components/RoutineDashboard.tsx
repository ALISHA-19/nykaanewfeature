import {
  AlertTriangle, CheckCircle2, Info, XCircle, X, Cloud, Droplets, Sun,
  Calendar, Shield, Palette, DollarSign, Sparkles, Flame, ThermometerSun,
} from 'lucide-react';
import { useBeautyStore } from '@/store/useBeautyStore';
import NykaaHeader from './NykaaHeader';
import SmartIntentBar from './SmartIntentBar';
import ProductCard from './ProductCard';
import ReorderModal from './ReorderModal';
import VirtualMirror from './VirtualMirror';
import ConflictModal from './ConflictModal';
import CategoryBrowser from './CategoryBrowser';
import type { Scenario } from '@/data/mockDatabase';
import heroImage from '@/assets/hero-beauty.jpg';
import { useState } from 'react';
import { toast } from 'sonner';

const scenarioIcons: Record<string, typeof Info> = {
  swap: ThermometerSun, alert: AlertTriangle, guard: Shield, nudge: Cloud,
  intent: Sparkles, goal: Flame, shade: Palette, conflict: AlertTriangle,
  budget: DollarSign, calendar: Calendar,
};

const severityStyles: Record<string, string> = {
  info: 'border-info/30 bg-info/5',
  warning: 'border-warning/30 bg-warning/5',
  success: 'border-success/30 bg-success/5',
  critical: 'border-destructive/30 bg-destructive/5',
};

const severityDot: Record<string, string> = {
  info: 'bg-info',
  warning: 'bg-warning',
  success: 'bg-success',
  critical: 'bg-destructive',
};

const ScenarioCard = ({ scenario, onDismiss, onAction, actionedLabel }: { scenario: Scenario; onDismiss: () => void; onAction: () => void; actionedLabel?: string }) => {
  const Icon = scenarioIcons[scenario.type] || Info;
  const isActioned = !!actionedLabel;
  return (
    <div className={`rounded-xl border p-4 ${isActioned ? 'border-success/30 bg-success/5' : severityStyles[scenario.severity]} animate-fade-in hover:shadow-sm transition-shadow`}>
      <div className="flex items-start gap-3">
        <div className={`h-8 w-8 rounded-full ${isActioned ? 'bg-success' : severityDot[scenario.severity]} flex items-center justify-center shrink-0`}>
          {isActioned ? <CheckCircle2 className="h-4 w-4 text-card" /> : <Icon className="h-4 w-4 text-card" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground">{scenario.title}</h4>
            <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{scenario.description}</p>
          {isActioned ? (
            <span className="mt-2 inline-block text-xs font-semibold text-success">
              {actionedLabel}
            </span>
          ) : scenario.actionLabel ? (
            <button
              onClick={onAction}
              className="mt-2 text-xs font-semibold text-primary hover:underline underline-offset-2"
            >
              {scenario.actionLabel} →
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const RoutineDashboard = () => {
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

  const handleScenarioAction = (scenarioId: string) => {
    const result = executeScenarioAction(scenarioId);

    switch (result.action) {
      case 'swap':
        toast.success('Product swapped successfully!', {
          description: `Your routine has been updated with the better-suited product.`,
        });
        break;
      case 'reorder':
        setReorderProductId(result.data.productId);
        markScenarioActioned(scenarioId, 'Reordered ✓');
        break;
      case 'guard':
        toast.error('Product Blocked', {
          description: 'This product contains allergens from your profile. It cannot be added.',
        });
        break;
      case 'routine':
        toast.success('Routine activated!', {
          description: 'Your routine has been switched. Scroll down to see the steps.',
        });
        break;
      case 'shade':
        setShowMirror(true);
        break;
      case 'conflict':
        setConflictProducts(result.data.products);
        break;
      case 'budget':
        swapProduct(result.data.from, result.data.to);
        toast.success('Budget swap applied!', {
          description: 'Switched to the affordable alternative. Same ingredients, better price.',
        });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NykaaHeader />

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

      {/* Hero Banner */}
      <div className="relative h-[180px] sm:h-[260px] overflow-hidden">
        <img src={heroImage} alt="Beauty collection" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent sm:from-foreground/70 sm:via-foreground/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container px-4 sm:px-8">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-primary-foreground/70 mb-1 sm:mb-2 font-medium">AI-Powered Beauty</p>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-serif font-bold text-primary-foreground leading-tight">
              Your Routine,<br />Intelligently Curated
            </h2>
            <p className="text-xs sm:text-sm text-primary-foreground/80 mt-1 sm:mt-2 max-w-sm hidden sm:block">
              Smart routines, proactive alerts, and ingredient safety — all personalized for {userProfile.name}.
            </p>
            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-4">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider bg-primary/90 text-primary-foreground px-2 sm:px-3 py-1 rounded-full font-semibold">
                Skin: {userProfile.skinType}
              </span>
              <button
                onClick={() => setShowMirror(true)}
                className="text-[9px] sm:text-[10px] uppercase tracking-wider bg-card/20 backdrop-blur text-primary-foreground px-2 sm:px-3 py-1 rounded-full font-medium hover:bg-card/30 transition-colors cursor-pointer"
              >
                Shade: {userProfile.shadeMatch} ✨
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 sm:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* Weather + Profile Strip */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 rounded-xl bg-muted p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-info" />
            <span className="text-xs font-medium text-foreground">{weather.condition}</span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <Droplets className="h-3.5 w-3.5 text-info" />
            <span className="text-xs text-muted-foreground">Humidity {weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sun className="h-3.5 w-3.5 text-warning" />
            <span className="text-xs text-muted-foreground">UV {weather.uvIndex}</span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs text-muted-foreground">Blocked: {userProfile.allergies.join(', ')}</span>
          </div>
          <div className="sm:ml-auto flex gap-1.5 flex-wrap">
            {userProfile.goals.map(g => (
              <span key={g} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{g}</span>
            ))}
          </div>
        </div>

        {/* Smart Intent Bar */}
        <SmartIntentBar />

        {/* Category Browser */}
        <CategoryBrowser />

        {/* Intelligence Feed */}
        {activeScenarios.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Intelligence Feed
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{activeScenarios.length} active</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeScenarios.map(s => (
                <ScenarioCard
                  key={s.id}
                  scenario={s}
                  onDismiss={() => dismissScenario(s.id)}
                  onAction={() => handleScenarioAction(s.id)}
                  actionedLabel={actionedScenarios[s.id]}
                />
              ))}
            </div>
          </section>
        )}

        {/* Routine Tabs */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">Your Routines</h2>
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            {allRoutines.map(r => (
              <button
                key={r.id}
                onClick={() => activateRoutine(r.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-colors border ${
                  activeRoutine?.id === r.id
                    ? 'nykaa-gradient text-primary-foreground border-transparent'
                    : 'bg-card text-foreground border-border hover:border-primary'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          {activeRoutine && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                  Goal: {activeRoutine.goal}
                </span>
                <p className="text-xs text-muted-foreground">{activeRoutine.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {activeRoutine.steps.map(step => {
                  const product = getProductById(step.productId);
                  if (!product) return null;
                  return (
                    <div key={step.order} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full nykaa-gradient flex items-center justify-center text-[11px] text-primary-foreground font-bold">
                          {step.order}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                          {step.timeOfDay}
                        </span>
                      </div>
                      <ProductCard product={product} reason={step.instruction} showGuard />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Replenishment */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Replenishment Tracker
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lowStock.length > 0 ? lowStock.map(item => {
              const product = getProductById(item.productId);
              if (!product) return null;
              const daysLeft = Math.round(item.remainingPercent / item.usageRatePerDay);
              return (
                <div key={item.productId} className="rounded-xl border border-warning/20 bg-warning/5 p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center text-lg font-bold text-warning shrink-0">
                    {item.remainingPercent}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.brand} · ~{daysLeft} days left</p>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mt-2">
                      <div className="h-full rounded-full bg-warning transition-all" style={{ width: `${item.remainingPercent}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => setReorderProductId(item.productId)}
                    className="nykaa-gradient rounded-lg px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
                  >
                    Reorder
                  </button>
                </div>
              );
            }) : null}
            {reorderQueue.length > 0 && reorderQueue.map(productId => {
              const product = getProductById(productId);
              if (!product) return null;
              const deliveryDate = new Date();
              deliveryDate.setDate(deliveryDate.getDate() + 3);
              const formattedDate = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
              return (
                <div key={productId} className="rounded-xl border border-success/30 bg-success/5 p-4 flex items-center gap-4 animate-fade-in">
                  <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{product.name}</p>
                    <p className="text-xs text-success font-medium">Reordered ✓</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Arriving {formattedDate}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider bg-success/10 text-success px-3 py-1 rounded-full font-bold shrink-0">
                    On its way
                  </span>
                </div>
              );
            })}
            {lowStock.length === 0 && reorderQueue.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-2">All products are well-stocked!</p>
            )}
          </div>
        </section>

        {/* Inventory */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">Your Inventory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {inventory.filter(i => i.remainingPercent >= 15).map(item => {
              const product = getProductById(item.productId);
              if (!product) return null;
              return (
                <div key={item.productId} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground shrink-0">
                    {product.brand.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground">{item.remainingPercent}%</p>
                    <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden mt-1">
                      <div className="h-full rounded-full bg-success" style={{ width: `${item.remainingPercent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-8 pb-6 text-center">
          <p className="text-xs text-muted-foreground">
            Nykaa Beauty Intelligence Platform · AI-Powered Routines · Ingredient Safety · Smart Replenishment
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">Demo — embedded with 10 autonomous scenarios</p>
        </footer>
      </div>
    </div>
  );
};

export default RoutineDashboard;
