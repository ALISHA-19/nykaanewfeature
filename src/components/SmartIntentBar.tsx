import { useState } from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useBeautyStore } from '@/store/useBeautyStore';

const suggestions = [
  { label: 'Fix my dull skin', icon: '✨' },
  { label: 'Prep me for date night', icon: '💄' },
  { label: 'Help with hormonal acne', icon: '🧴' },
  { label: 'Winter hydration routine', icon: '❄️' },
  { label: 'Wedding-ready in 10 days', icon: '💍' },
];

const SmartIntentBar = () => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const processIntent = useBeautyStore(s => s.processIntent);

  const handleSubmit = (q: string) => {
    if (!q.trim()) return;
    processIntent(q);
    setValue('');
    setFocused(false);
  };

  return (
    <div className="relative">
      <div className="rounded-xl bg-secondary border border-primary/20 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold text-foreground">What's your beauty goal?</h3>
          <span className="text-[10px] font-semibold text-primary-foreground bg-primary px-2 py-0.5 rounded-full ml-1">AI POWERED</span>
        </div>
        <div className={`flex items-center gap-2 rounded-lg border bg-card px-4 py-3 transition-all ${focused ? 'border-primary shadow-md shadow-primary/10' : 'border-border'}`}>
          <Zap className="h-4 w-4 text-primary shrink-0" />
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit(value)}
            placeholder="Type your goal — e.g. 'clear acne', 'glow for my wedding'..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => handleSubmit(value)}
            className="nykaa-gradient rounded-lg px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            Go <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {suggestions.map(s => (
            <button
              key={s.label}
              onMouseDown={() => handleSubmit(s.label)}
              className="text-xs border border-border rounded-full px-3 py-1.5 bg-card text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartIntentBar;
