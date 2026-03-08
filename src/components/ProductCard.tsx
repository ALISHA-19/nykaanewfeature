import { ArrowRightLeft } from 'lucide-react';
import { useBeautyStore } from '@/store/useBeautyStore';
import WhyTooltip from './WhyTooltip';
import IngredientGuard from './IngredientGuard';
import type { Product } from '@/data/mockDatabase';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  reason?: string;
  showSwap?: boolean;
  showGuard?: boolean;
  compact?: boolean;
}

const tierColors: Record<string, string> = {
  budget: 'bg-success/10 text-success',
  mid: 'bg-info/10 text-info',
  luxury: 'bg-accent/10 text-accent',
};

const ProductCard = ({ product, reason, showSwap = true, showGuard = false, compact = false }: ProductCardProps) => {
  const recommendAlternatives = useBeautyStore(s => s.recommendAlternatives);
  const [showAlts, setShowAlts] = useState(false);
  const alts = showSwap ? recommendAlternatives(product.id) : [];

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-xs font-serif text-secondary-foreground">
          {product.brand.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-sans font-medium text-foreground truncate">{product.name}</p>
          <p className="text-xs text-muted-foreground font-sans">{product.brand} · ${product.price}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] uppercase tracking-widest font-sans font-semibold px-2 py-0.5 rounded-full ${tierColors[product.tier]}`}>
              {product.tier}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
              {product.category}
            </span>
          </div>
          <h3 className="text-lg font-serif font-semibold text-foreground">{product.name}</h3>
          <p className="text-sm text-muted-foreground font-sans">{product.brand} · ${product.price}</p>
        </div>
        <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-lg font-serif text-secondary-foreground shrink-0">
          {product.brand.charAt(0)}
        </div>
      </div>

      <p className="text-sm text-muted-foreground font-sans leading-relaxed">{product.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {product.ingredients.slice(0, 4).map(ing => (
          <span key={ing} className="text-[11px] font-sans px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            {ing}
          </span>
        ))}
      </div>

      {reason && (
        <WhyTooltip reason={reason}>
          <button className="text-xs text-accent font-sans underline underline-offset-2 hover:opacity-80 transition-opacity">
            Why this product?
          </button>
        </WhyTooltip>
      )}

      <div className="flex items-center gap-2 pt-1">
        {showGuard && <IngredientGuard productId={product.id} />}

        {showSwap && alts.length > 0 && (
          <button
            onClick={() => setShowAlts(!showAlts)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-sans text-muted-foreground hover:bg-secondary transition-colors"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            Swap
          </button>
        )}
      </div>

      {showAlts && alts.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border animate-fade-in">
          <p className="text-xs text-muted-foreground font-sans">Alternatives:</p>
          {alts.map(alt => (
            <ProductCard key={alt.id} product={alt} compact showSwap={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
