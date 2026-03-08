import { X, Palette, CheckCircle2 } from 'lucide-react';
import { useBeautyStore } from '@/store/useBeautyStore';

interface VirtualMirrorProps {
  onClose: () => void;
}

const shades = [
  { code: 'NC15', label: 'Fair', color: '#F5D6BA' },
  { code: 'NC25', label: 'Light-Medium', color: '#E8C4A0' },
  { code: 'NC35', label: 'Medium', color: '#D4A574' },
  { code: 'NC42', label: 'Medium-Tan', color: '#C08E5E' },
  { code: 'NC50', label: 'Deep', color: '#A06B3C' },
];

const VirtualMirror = ({ onClose }: VirtualMirrorProps) => {
  const { userProfile } = useBeautyStore();
  const matchedShade = shades.find(s => s.code === userProfile.shadeMatch.replace('MAC ', '')) || shades[2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Virtual Shade Match
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Face silhouette with shade overlay */}
          <div className="relative mx-auto w-48 h-56 rounded-[50%] overflow-hidden border-4 border-border">
            <div
              className="absolute inset-0 transition-colors duration-500"
              style={{ backgroundColor: matchedShade.color }}
            />
            {/* Simple face features */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex gap-8 mb-4">
                <div className="h-4 w-6 rounded-full bg-foreground/20" />
                <div className="h-4 w-6 rounded-full bg-foreground/20" />
              </div>
              <div className="h-2 w-4 rounded-full bg-foreground/15 mb-3" />
              <div className="h-3 w-10 rounded-full bg-foreground/10" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-bold text-foreground">Your Match: MAC {matchedShade.code}</p>
            <p className="text-sm text-muted-foreground">{matchedShade.label} · Warm Undertone</p>
          </div>

          {/* Shade swatches */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">All Shades</p>
            <div className="flex gap-3 justify-center">
              {shades.map(shade => (
                <button
                  key={shade.code}
                  className={`relative flex flex-col items-center gap-1.5 group`}
                >
                  <div
                    className={`h-12 w-12 rounded-full border-2 transition-all ${
                      shade.code === matchedShade.code
                        ? 'border-primary scale-110 shadow-lg'
                        : 'border-border hover:border-primary/50'
                    }`}
                    style={{ backgroundColor: shade.color }}
                  />
                  {shade.code === matchedShade.code && (
                    <CheckCircle2 className="absolute -top-1 -right-1 h-4 w-4 text-primary bg-card rounded-full" />
                  )}
                  <span className="text-[10px] text-muted-foreground font-medium">{shade.code}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-success/10 border border-success/20 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            <p className="text-xs text-success font-medium">
              Digital Twin matched you to {matchedShade.code} — MAC Studio Fix Foundation NC35 is in your routine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualMirror;
