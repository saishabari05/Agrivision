import { motion } from 'framer-motion';

function StatCard({ title, value, detail, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-panel p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          <p className="mt-2 text-sm text-slate-600">{detail}</p>
        </div>
        <div className="rounded-2xl bg-moss-100 p-3 text-moss-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;

