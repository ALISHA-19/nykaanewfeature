import { AlertTriangle, X, ArrowRight } from 'lucide-react';
import { useBeautyStore } from '@/store/useBeautyStore';

interface ConflictModalProps {
  productIds: string[];
  onClose: () => void;
}

const ConflictModal = ({ productIds, onClose }: ConflictModalProps) => {
  const { getProductById } = useBeautyStore();
  const products = productIds.map(id => getProductById(id)).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Ingredient Conflict
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {products.length >= 2 && (
            <div className="flex items-center gap-3 justify-center">
              <div className="text-center">
                <div className="h-14 w-14 rounded-lg bg-destructive/10 flex items-center justify-center text-lg font-bold text-destructive mx-auto">
                  {products[0]!.brand.charAt(0)}
                </div>
                <p className="text-xs font-semibold text-foreground mt-2">{products[0]!.name}</p>
                <p className="text-[10px] text-muted-foreground">{products[0]!.brand}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-destructive shrink-0" />
              <div className="text-center">
                <div className="h-14 w-14 rounded-lg bg-destructive/10 flex items-center justify-center text-lg font-bold text-destructive mx-auto">
                  {products[1]!.brand.charAt(0)}
                </div>
                <p className="text-xs font-semibold text-foreground mt-2">{products[1]!.name}</p>
                <p className="text-[10px] text-muted-foreground">{products[1]!.brand}</p>
              </div>
            </div>
          )}

          <div className="rounded-lg bg-warning/10 border border-warning/20 p-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">⚠️ Active Conflict</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Retinol and Vitamin C should not be used together. They can cause irritation and reduce each other's effectiveness.
            </p>
            <p className="text-xs font-semibold text-foreground mt-2">Recommendation:</p>
            <p className="text-xs text-muted-foreground">Use Vitamin C in the <strong>morning</strong> and Retinol in the <strong>evening</strong>. Never layer them in the same routine step.</p>
          </div>

          <button
            onClick={onClose}
            className="w-full nykaa-gradient rounded-xl py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Got it — I'll alternate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;
