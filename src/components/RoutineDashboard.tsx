import {
  AlertTriangle, CheckCircle2, Info, XCircle, X, Cloud, Droplets, Sun,
} from 'lucide-react';
import { useBeautyStore } from '@/store/useBeautyStore';
import SmartIntentBar from './SmartIntentBar';
import ProductCard from './ProductCard';
import type { Scenario } from '@/data/mockDatabase';
import heroImage from '@/assets/hero-beauty.jpg';

const severityConfig: Record<string, { icon: typeof Info; className: string }> = {
  info: { icon: Info, className: 'border-info/20 bg-info/5' },
  warning: { icon: AlertTriangle, className: 'border-warning/20 bg-warning/5' },
  success: { icon: CheckCircle2, className: 'border-success/20 bg-success/5' },
  critical: { icon: XCircle, className: 'border-destructive/20 bg-destructive/5' },
};

const ScenarioCard = ({ scenario, onDismiss }: { scenario: Scenario; onDismiss: () => void }) => {
  const config = severityConfig[scenario.severity];
  const Icon = config.icon;
  return (
    <div className={`rounded-xl border p-4 ${config.className} animate-fade-in`}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 shrink-0 mt-0.5" style={{ color: `hsl(var(--${scenario.severity === 'critical' ? 'destructive' : scenario.severity}))` }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-sans font-semibold text-foreground">{scenario.title}</h4>
            <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground font-sans mt-1 leading-relaxed">{scenario.description}</p>
          {scenario.actionLabel && (
            <button className="text-xs text-accent font-sans font-medium mt-2 hover:underline underline-offset-2">
              {scenario.actionLabel} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const RoutineDashboard = () => {
  const {
    userProfile, activeRoutine, inventory, scenarios, weather,
    dismissScenario, getProductById, checkReplenishment,
  } = useBeautyStore();

  const activeScenarios = scenarios.filter(s => s.active);
  const lowStock = checkReplenishment();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[340px] overflow-hidden">
        <img src={heroImage} alt="Beauty products" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-4">
          <p className="text-sm font-sans text-muted-foreground mb-1">Welcome back, {userProfile.name}</p>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground text-center mb-6">
            Your Beauty Intelligence
          </h1>
          <SmartIntentBar />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Weather Bar */}
        <div className="flex items-center gap-6 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-info" />
            <span className="text-sm font-sans text-foreground">{weather.condition}</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-info" />
            <span className="text-xs font-sans text-muted-foreground">Humidity {weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-warning" />
            <span className="text-xs font-sans text-muted-foreground">UV Index {weather.uvIndex}</span>
          </div>
        </div>

        {/* Alerts Grid */}
        {activeScenarios.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-semibold text-foreground mb-4">Intelligence Feed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeScenarios.map(s => (
                <ScenarioCard key={s.id} scenario={s} onDismiss={() => dismissScenario(s.id)} />
              ))}
            </div>
          </section>
        )}

        {/* Active Routine */}
        {activeRoutine && (
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h2 className="text-xl font-serif font-semibold text-foreground">{activeRoutine.name}</h2>
                <p className="text-sm text-muted-foreground font-sans mt-0.5">{activeRoutine.description}</p>
              </div>
              <span className="text-xs font-sans px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                Goal: {activeRoutine.goal}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeRoutine.steps.map(step => {
                const product = getProductById(step.productId);
                if (!product) return null;
                return (
                  <div key={step.order} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground font-sans font-bold">
                        {step.order}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                        {step.timeOfDay}
                      </span>
                    </div>
                    <ProductCard
                      product={product}
                      reason={step.instruction}
                      showGuard
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Replenishment */}
        {lowStock.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-semibold text-foreground mb-4">Replenishment Tracker</h2>
            <div className="space-y-3">
              {lowStock.map(item => {
                const product = getProductById(item.productId);
                if (!product) return null;
                const daysLeft = Math.round(item.remainingPercent / item.usageRatePerDay);
                return (
                  <div key={item.productId} className="rounded-xl border border-warning/20 bg-warning/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-sans font-semibold text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground font-sans">{product.brand} · ~{daysLeft} days left</p>
                      </div>
                      <button className="text-xs font-sans font-medium text-accent hover:underline underline-offset-2">
                        Reorder →
                      </button>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-warning transition-all duration-500"
                        style={{ width: `${item.remainingPercent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground font-sans mt-1">{item.remainingPercent}% remaining</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Inventory */}
        <section>
          <h2 className="text-xl font-serif font-semibold text-foreground mb-4">Your Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inventory.filter(i => i.remainingPercent >= 15).map(item => {
              const product = getProductById(item.productId);
              if (!product) return null;
              return (
                <div key={item.productId} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-sm font-serif text-secondary-foreground shrink-0">
                    {product.brand.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground font-sans">{product.brand}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-sans font-semibold text-foreground">{item.remainingPercent}%</p>
                    <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden mt-1">
                      <div className="h-full rounded-full bg-success transition-all" style={{ width: `${item.remainingPercent}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RoutineDashboard;
