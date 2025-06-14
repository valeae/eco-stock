interface ProgressBarProps {
  valor: number;
  color: string;
}

const ProgressBar = ({ valor, color }: ProgressBarProps) => (
  <div className="w-full bg-muted-light rounded-full h-3 overflow-hidden">
    <div
      className={`h-full rounded-full transition-all duration-300 ease-out ${color}`}
      style={{ 
        width: `${Math.min(Math.max(valor || 0, 0), 100)}%`,
        minWidth: valor > 0 ? '4px' : '0px'
      }}
    />
  </div>
);

export default ProgressBar;