import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useBeautyStore } from '@/store/useBeautyStore';
import { useState } from 'react';

interface IngredientGuardProps {
  productId: string;
  children?: React.ReactNode;
}

const IngredientGuard = ({ productId, children }: IngredientGuardProps) => {
  const validateIngredients = useBeautyStore(s => s.validateIngredients);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<{ safe: boolean; reason?: string } | null>(null);

  const handleCheck = () => {
    const res = validateIngredients(productId);
    setResult(res);
    setChecked(true);
  };

  if (!checked) {
    return (
      <button
        onClick={handleCheck}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-sans text-primary-foreground hover:opacity-90 transition-opacity"
      >
        <ShieldCheck className="h-4 w-4" />
        Add to Routine
      </button>
    );
  }

  if (result && !result.safe) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-2.5">
          <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />
          <p className="text-xs text-destructive font-sans">{result.reason}</p>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg bg-success/10 border border-success/20 px-4 py-2.5">
      <ShieldCheck className="h-4 w-4 text-success" />
      <p className="text-xs text-success font-sans">Safe to add — no conflicts detected</p>
    </div>
  );
};

export default IngredientGuard;
