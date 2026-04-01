import { TrendingDown, TrendingUp } from 'lucide-react';
import Card from './Card';

function MetricCard({ label, value, trend, positive = true }) {
  return (
    <Card className="min-h-[156px]">
      <p className="panel-label">{label}</p>
      <div className="mt-5 flex items-end justify-between gap-3">
        <p className="text-4xl font-bold leading-none tracking-[-0.03em] text-text-dark sm:text-[2.7rem]">{value}</p>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${positive ? 'bg-moss-pale text-moss' : 'bg-rose-100 text-rose-700'}`}>
          {positive ? 'Stable' : 'Watch'}
        </span>
      </div>
      <div className={`mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${positive ? 'bg-moss-pale text-moss' : 'bg-rose-100 text-rose-700'}`}>
        {positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        {trend}
      </div>
    </Card>
  );
}

export default MetricCard;
