import { ArrowRightLeft, ShieldCheck, ShieldAlert } from 'lucide-react';
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
  budget: 'bg-success/10 text-success',
  mid: 'bg-info/10 text-info',
  luxury: 'bg-primary/10 text-primary',
};

const ProductCard = ({ product, reason, showSwap = true, showGuard = false, compact = false }: ProductCardProps) => {
  const { recommendAlternatives, validateIngredients } = useBeautyStore();
  const [showAlts, setShowAlts] = useState(false);
  const [guardResult, setGuardResult] = useState<{ safe: boolean; reason?: string } | null>(null);
  const alts = showSwap ? recommendAlternatives(product.id) : [];

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 hover:shadow-sm transition-shadow">
        <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center text-base font-bold text-secondary-foreground shrink-0">
          {product.brand.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
          <p className="text-xs text-muted-foreground">{product.brand} · <span className="font-semibold text-primary">₹{(product.price * 83).toLocaleString()}</span></p>
        </div>
        {showSwap && alts.length > 0 && (
          <button onClick={() => setShowAlts(!showAlts)} className="text-xs text-primary hover:underline">Swap</button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow group animate-fade-in">
      {/* Product image placeholder */}
      <div className="h-44 bg-gradient-to-br from-secondary to-muted flex items-center justify-center relative">
        <span className="text-4xl font-serif font-bold text-primary/20">{product.brand.charAt(0)}{product.brand.charAt(1)}</span>
        <span className={`absolute top-3 left-3 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${tierBadge[product.tier]}`}>
          {product.tier}
        </span>
        {showSwap && alts.length > 0 && (
          <button
            onClick={() => setShowAlts(!showAlts)}
            className="absolute top-3 right-3 bg-card/90 backdrop-blur rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity border border-border hover:border-primary"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-foreground" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-2.5">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{product.brand}</p>
          <h3 className="text-sm font-semibold text-foreground leading-tight">{product.name}</h3>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{product.description}</p>

        <div className="flex flex-wrap gap-1">
          {product.ingredients.slice(0, 3).map(ing => (
            <span key={ing} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{ing}</span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-lg font-bold text-foreground">₹{(product.price * 83).toLocaleString()}</p>
          <div className="flex items-center gap-2">
            {reason && (
              <WhyTooltip reason={reason}>
                <button className="text-[10px] text-primary underline underline-offset-2">Why this?</button>
              </WhyTooltip>
            )}
          </div>
        </div>

        {/* Ingredient Guard */}
        {showGuard && (
          <div>
            {!guardResult ? (
              <button
                onClick={() => setGuardResult(validateIngredients(product.id))}
                className="w-full nykaa-gradient rounded-lg py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Add to Routine
              </button>
            ) : guardResult.safe ? (
              <div className="flex items-center gap-2 rounded-lg bg-success/10 border border-success/20 px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                <p className="text-xs text-success font-medium">Safe — no conflicts</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2">
                <ShieldAlert className="h-4 w-4 text-destructive" />
                <p className="text-xs text-destructive">{guardResult.reason}</p>
              </div>
            )}
          </div>
        )}

        {/* Alternatives */}
        {showAlts && alts.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border animate-fade-in">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Smart Swaps</p>
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
