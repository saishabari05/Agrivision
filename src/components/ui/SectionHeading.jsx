function SectionHeading({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss-700">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export default SectionHeading;

