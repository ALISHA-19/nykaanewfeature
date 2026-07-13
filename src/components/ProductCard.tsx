import { ArrowRightLeft, ShieldCheck, ShieldAlert, Star, Sparkles } from 'lucide-react';
import { useBeautyStore } from '@/store/useBeautyStore';
import WhyTooltip from './WhyTooltip';
import type { Product } from '@/data/mockDatabase';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  reason?: string;
  showSwap?: boolean;
  showGuard?: boolean;
  compact?: boolean;
}

const tierBadge: Record<string, string> = {
  budget: 'bg-success-soft text-success border-success/20',
  mid: 'bg-info-soft text-info border-info/20',
  luxury: 'bg-primary-soft text-primary border-primary/20',
};

const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i < full
              ? 'fill-accent text-accent'
              : i === full && half
              ? 'fill-accent/50 text-accent'
              : 'fill-muted text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
};

const ProductCard = ({ product, reason, showSwap = true, showGuard = false, compact = false }: ProductCardProps) => {
  const { recommendAlternatives, validateIngredients } = useBeautyStore();
  const [showAlts, setShowAlts] = useState(false);
  const [guardResult, setGuardResult] = useState<{ safe: boolean; reason?: string } | null>(null);
  const alts = showSwap ? recommendAlternatives(product.id) : [];

  const mrpInr = Math.round(product.mrp * 83);
  const priceInr = Math.round(product.price * 83);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 hover:border-primary/20 transition-all">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-11 w-11 rounded-lg object-contain shrink-0" />
        ) : (
          <div className="h-11 w-11 rounded-lg bg-secondary flex items-center justify-center text-sm font-semibold text-secondary-foreground shrink-0">
            {product.brand.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
          <p className="text-xs text-muted-foreground">
            {product.brand} · <span className="font-semibold text-foreground">₹{priceInr.toLocaleString()}</span>
            {discount > 0 && <span className="text-success ml-1 text-[10px] font-bold">-{discount}%</span>}
          </p>
        </div>
        {showSwap && alts.length > 0 && (
          <button onClick={() => setShowAlts(!showAlts)} className="text-xs text-primary hover:underline">Swap</button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md hover:border-primary/15 transition-all group animate-fade-in">
      {/* Product image */}
      <div className="h-32 sm:h-40 bg-gradient-to-br from-muted/40 to-primary-soft/40 flex items-center justify-center relative overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-3 transition-transform group-hover:scale-105" />
        ) : (
          <span className="text-4xl font-serif italic text-primary/30">{product.brand.charAt(0)}</span>
        )}
        <span className={`absolute top-2.5 left-2.5 aura-badge ${tierBadge[product.tier]}`}>
          {product.tier}
        </span>
        {showSwap && alts.length > 0 && (
          <button
            onClick={() => setShowAlts(!showAlts)}
            className="absolute top-2.5 right-2.5 bg-card/95 backdrop-blur rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity border border-border shadow-sm hover:border-primary"
            aria-label="Show alternatives"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-foreground" />
          </button>
        )}
      </div>

      <div className="p-3 sm:p-4 space-y-2.5">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">{product.brand}</p>
          <h3 className="text-sm font-semibold text-foreground leading-snug mt-0.5 line-clamp-2">{product.name}</h3>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <StarRating rating={product.rating} />
          <span className="text-[11px] font-semibold text-foreground">{product.rating}</span>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            · {(product.ratingCount / 1000).toFixed(1)}k
          </span>
        </div>

        <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2 hidden sm:block">{product.description}</p>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <p className="text-base sm:text-lg font-semibold text-foreground">₹{priceInr.toLocaleString()}</p>
          {discount > 0 && (
            <>
              <span className="text-xs text-muted-foreground line-through">₹{mrpInr.toLocaleString()}</span>
              <span className="text-[11px] font-semibold text-success">-{discount}%</span>
            </>
          )}
        </div>

        {/* AI reasoning */}
        {reason && (
          <WhyTooltip reason={reason}>
            <button className="w-full flex items-center gap-1.5 text-[11px] text-primary bg-primary-soft/50 hover:bg-primary-soft rounded-lg px-2.5 py-1.5 transition-colors">
              <Sparkles className="h-3 w-3" />
              <span className="font-medium">Why Aura recommends this</span>
            </button>
          </WhyTooltip>
        )}

        {/* AI Safety Intelligence */}
        {showGuard && (
          <div>
            {!guardResult ? (
              <button
                onClick={() => setGuardResult(validateIngredients(product.id))}
                className="w-full aura-gradient rounded-xl py-2.5 text-xs font-semibold text-primary-foreground hover:shadow-glow transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Add to my routine
              </button>
            ) : guardResult.safe ? (
              <div className="flex items-center gap-2 rounded-xl bg-success-soft border border-success/20 px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                <p className="text-xs text-success font-medium">Safe — I verified it.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-3 py-2">
                <ShieldAlert className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-destructive leading-snug">I blocked this — {guardResult.reason}</p>
              </div>
            )}
          </div>
        )}

        {/* Alternatives */}
        {showAlts && alts.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border animate-fade-in">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Aura suggests</p>
            {alts.map(alt => (
              <ProductCard key={alt.id} product={alt} compact showSwap={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
