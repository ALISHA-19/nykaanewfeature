import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useBeautyStore } from '@/store/useBeautyStore';

const SmartIntentBar = () => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const processIntent = useBeautyStore(s => s.processIntent);

  const suggestions = [
    'Fix my dull skin',
    'Prep me for date night',
    'Help with hormonal acne',
    'Winter hydration routine',
  ];

  const handleSubmit = (q: string) => {
    if (!q.trim()) return;
    processIntent(q);
    setValue('');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className={`flex items-center gap-3 rounded-full border bg-card px-5 py-3.5 transition-all duration-300 ${focused ? 'border-accent shadow-lg shadow-accent/10' : 'border-border'}`}>
        <Sparkles className="h-5 w-5 text-accent shrink-0" />
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit(value)}
          placeholder="What's your beauty goal today?"
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm font-sans"
        />
        <button
          onClick={() => handleSubmit(value)}
          className="rounded-full bg-primary p-2 text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      {focused && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-card p-3 shadow-xl z-50 animate-fade-in">
          <p className="text-xs text-muted-foreground mb-2 px-2 font-sans">Try asking…</p>
          <div className="space-y-1">
            {suggestions.map(s => (
              <button
                key={s}
                onMouseDown={() => handleSubmit(s)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors font-sans"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartIntentBar;
