import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { ClockIcon } from '@heroicons/react/24/outline';

interface DueDateBadgeProps {
  dueDate: string | null;
  completed: boolean;
}

export default function DueDateBadge({ dueDate, completed }: DueDateBadgeProps) {
  if (!dueDate) return null;

  const date = new Date(dueDate);
  const now = new Date();
  const daysUntil = differenceInDays(date, now);

  let statusText = '';
  let statusColor = '';

  if (completed) {
    statusText = format(date, 'MMM dd');
    statusColor = 'bg-gray-100 text-gray-600 border-gray-200';
  } else if (isPast(date) && !isToday(date)) {
    statusText = `Overdue`;
    statusColor = 'bg-red-100 text-red-700 border-red-200';
  } else if (isToday(date)) {
    statusText = 'Today';
    statusColor = 'bg-orange-100 text-orange-700 border-orange-200';
  } else if (isTomorrow(date)) {
    statusText = 'Tomorrow';
    statusColor = 'bg-yellow-100 text-yellow-700 border-yellow-200';
  } else if (daysUntil <= 7) {
    statusText = `${daysUntil}d`;
    statusColor = 'bg-blue-100 text-blue-700 border-blue-200';
  } else {
    statusText = format(date, 'MMM dd');
    statusColor = 'bg-gray-100 text-gray-600 border-gray-200';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor}`}
      title={`Due: ${format(date, 'MMMM dd, yyyy')}`}
    >
      <ClockIcon className="h-3 w-3" />
      <span>{statusText}</span>
    </span>
  );
}