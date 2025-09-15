import React from 'react';

type Variant = 'outlined' | 'solid';
type Size = 'sm' | 'md';

interface RequestBadgeProps {
  requestName: string;
  emoji?: string;            // emoji explícito si quieres forzar
  autoEmoji?: boolean;       // true = intentar usar emoji automático
  withIcon?: boolean;        // legacy prop similar al que usabas
  variant?: Variant;
  size?: Size;
  className?: string;
}

const emojiRules: [RegExp, string][] = [
  [/\byoga\b/i, '🧘'],
  [/\bsurf|surfing\b/i, '🏄'],
  [/\bbike|biking|mountain\b/i, '🚵'],
  [/\bpaint|painting\b/i, '🎨'],
  [/\bguitar\b/i, '🎸'],
  [/\bplay(ing)? guitar\b/i, '🎸'],
  [/\bphoto|photography\b/i, '📷'],
  [/\bvideo\b/i, '🎥'],
  [/\bcode|dev|developer|programming\b/i, '💻'],
  [/\bwrite|writing\b/i, '✍️'],
  [/\bcoffee\b/i, '☕'],
  [/\bmeeting\b/i, '📅'],
  [/\bdesign\b/i, '🎨'],
  [/\bdefault\b/i, '🔖'],
];

function pickEmoji(name: string): string | undefined {
  if (!name) return undefined;
  for (const [rx, emoji] of emojiRules) {
    if (rx.test(name)) return emoji;
  }
  return undefined;
}

const HobbiesBadge: React.FC<RequestBadgeProps> = ({
  requestName,
  emoji,
  autoEmoji = true,
  withIcon = true,
  variant = 'outlined',
  size = 'sm',
  className = '',
}) => {
  const auto = autoEmoji ? pickEmoji(requestName) : undefined;
  const usedEmoji = emoji ?? auto;
  const base = 'inline-flex items-center gap-2 rounded-full px-3';
  const sizeClasses = size === 'sm' ? 'py-1 text-sm' : 'py-2 text-base';
  const outlined = variant === 'outlined'
    ? 'bg-transparent border border-[#3F4744] hover:bg-gray-50'
    : 'bg-gray-100 text-gray-800';
  return (
    <span
      className={`${base} ${sizeClasses} ${outlined} ${className}`}
      title={requestName}
      aria-label={requestName}
    >
      {withIcon && usedEmoji ? (
        <span aria-hidden="true" className="leading-none">{usedEmoji}</span>
      ) : null}
      <span className="whitespace-nowrap">{requestName}</span>
    </span>
  );
};

export default HobbiesBadge;