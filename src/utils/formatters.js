export function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function severityColor(severity) {
  if (severity === 'High') return 'bg-rose-100 text-rose-700';
  if (severity === 'Moderate') return 'bg-amber-100 text-amber-700';
  return 'bg-emerald-100 text-emerald-700';
}

