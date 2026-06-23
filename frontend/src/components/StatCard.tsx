import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
}

export function StatCard({ label, value, icon: Icon, gradient, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm hover:border-white/[0.16] hover:bg-white/[0.06] transition-all duration-300"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-300`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-white/40 font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
