import { useState } from 'react';
import { Info } from 'lucide-react';

interface WhyTooltipProps {
  reason: string;
  children: React.ReactNode;
}

const WhyTooltip = ({ reason, children }: WhyTooltipProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg border border-border bg-card p-3 shadow-lg z-50 animate-fade-in">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">{reason}</p>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 rotate-45 bg-card border-r border-b border-border" />
        </div>
      )}
    </div>
  );
};

export default WhyTooltip;
