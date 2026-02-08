import { PRIORITIES } from '@/lib/constants';

interface PriorityBadgeProps {
  priority: string | null;
  size?: 'sm' | 'md';
}

export default function PriorityBadge({ priority, size = 'sm' }: PriorityBadgeProps) {
  if (!priority) return null;

  const pri = PRIORITIES.find(p => p.value === priority);
  if (!pri) return null;

  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';
  const colorClass = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  }[pri.color];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${colorClass} ${sizeClasses}`}
      title={`Priority: ${pri.label}`}
    >
      <span>{pri.icon}</span>
      <span>{pri.label}</span>
    </span>
  );
}