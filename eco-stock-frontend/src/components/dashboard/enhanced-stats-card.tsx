interface Props {
  title: string;
  value: string;
  type: 'total' | 'stock' | 'salidas';
  period: string;
}

export default function EnhancedStatsCard({ title, value, type, period }: Props) {
  const typeStyles: Record<string, string> = {
    total: 'border-blue-500 bg-blue-50 text-blue-900',
    stock: 'border-green-500 bg-green-50 text-green-900',
    salidas: 'border-red-500 bg-red-50 text-red-900',
  };

  const iconColors: Record<string, string> = {
    total: 'text-blue-600',
    stock: 'text-green-600',
    salidas: 'text-red-600',
  };

  const style = typeStyles[type] ?? 'border-muted bg-muted text-foreground';
  const iconColor = iconColors[type] ?? 'text-muted';

  const getIcon = () => {
    switch (type) {
      case 'total':
        return <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"> <title>Total</title> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
      case 'stock':
        return <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"> <title>Stock</title> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
      case 'salidas':
        return <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"> <title>Salidas</title> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
      default:
        return null;
    }
  };

  return (
    <div className={`p-4 rounded-md border-l-4 shadow-sm hover:bg-muted-light transition-colors ${style}`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-sm">{title}</h4>
        <div className="w-6 h-6 flex items-center justify-center">
          {getIcon()}
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <p className="text-xs text-muted-foreground">{period}</p>
    </div>
  );
}
