interface Props {
  title: string;
  description: string;
  date: string;
  type: 'warning' | 'info' | 'success' | 'error' | string;
}

export default function NotificationItem({ title, description, date, type }: Props) {
  const typeStyles: Record<string, string> = {
    warning: 'border-warning bg-yellow-50 text-yellow-900',
    info: 'border-accent-DEFAULT bg-blue-50 text-blue-900',
    success: 'border-success bg-green-50 text-green-900',
    error: 'border-error bg-red-50 text-red-900',
  };

  const borderClass = typeStyles[type] ?? 'border-muted-DEFAULT bg-muted text-foreground';

  return (
    <div
      className={`p-4 rounded-md shadow-sm transition-colors hover:bg-muted-light border-l-4 ${borderClass}`}
    >
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-semibold text-sm">{title}</h4>
        <span className="text-xs text-muted-dark">{date}</span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
