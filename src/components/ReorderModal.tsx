import { Package, Truck, CheckCircle2, X } from 'lucide-react';
import { useBeautyStore } from '@/store/useBeautyStore';
import { useState } from 'react';

interface ReorderModalProps {
  productId: string;
  onClose: () => void;
}

const ReorderModal = ({ productId, onClose }: ReorderModalProps) => {
  const { getProductById, reorderProduct } = useBeautyStore();
  const [confirmed, setConfirmed] = useState(false);
  const product = getProductById(productId);

  if (!product) return null;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDate = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });

  const handleConfirm = () => {
    reorderProduct(productId);
    setConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-base font-bold text-foreground">
            {confirmed ? 'Order Confirmed!' : 'Confirm Reorder'}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {confirmed ? (
            <div className="text-center py-4 space-y-3 animate-fade-in">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <p className="text-sm font-semibold text-foreground">{product.name} is on its way!</p>
              <p className="text-xs text-muted-foreground">Expected delivery: {formattedDate}</p>
              <p className="text-xs text-muted-foreground">Your inventory has been updated to 100%.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 rounded-xl bg-muted p-4">
                <div className="h-14 w-14 rounded-lg bg-secondary flex items-center justify-center text-lg font-bold text-secondary-foreground shrink-0">
                  {product.brand.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                  <p className="text-base font-bold text-primary mt-1">₹{(product.price * 83).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Truck className="h-4 w-4 text-info shrink-0" />
                  <span>Estimated delivery: <strong className="text-foreground">{formattedDate}</strong></span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Package className="h-4 w-4 text-success shrink-0" />
                  <span>Auto-refill enabled — we'll remind you before you run out again</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full nykaa-gradient rounded-xl py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Confirm Reorder — ₹{(product.price * 83).toLocaleString()}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReorderModal;
