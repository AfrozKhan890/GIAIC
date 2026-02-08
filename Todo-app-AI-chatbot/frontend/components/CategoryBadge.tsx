import { CATEGORIES } from '@/lib/constants';

interface CategoryBadgeProps {
  category: string | null;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  if (!category) return null;

  const cat = CATEGORIES.find(c => c.value === category);
  if (!cat) return null;

  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';
  const colorClass = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    teal: 'bg-teal-100 text-teal-800 border-teal-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200'
  }[cat.color];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${colorClass} ${sizeClasses}`}
      title={`Category: ${cat.label}`}
    >
      <span>{cat.icon}</span>
      <span>{cat.label}</span>
    </span>
  );
}