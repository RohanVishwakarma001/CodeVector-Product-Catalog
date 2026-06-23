import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Package, Layers, Zap, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/StatCard';
import { useStats } from '@/hooks/useStats';
import { formatCompact } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const features = [
  {
    icon: Zap,
    title: 'Cursor-Based Pagination',
    description:
      'Zero duplicates and no missing records. Stable ordering via (updated_at DESC, id DESC) composite cursor survives concurrent inserts.',
    gradient: 'from-violet-500 to-indigo-500',
  },
  {
    icon: TrendingUp,
    title: '200,000+ Products',
    description:
      'Bulk-seeded with batch processing. Composite indexes on (updatedAt, id) and (category, updatedAt, id) keep queries sub-millisecond.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Enterprise Architecture',
    description:
      'Clean layered backend (controller → service → repository), TanStack Query infinite scroll, and Intersection Observer on the frontend.',
    gradient: 'from-emerald-500 to-green-500',
  },
];

export default function HomePage() {
  const { data: stats, isLoading } = useStats();

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300"
          >
            <Zap className="h-3.5 w-3.5" />
            Production-grade cursor pagination
          </motion.div>

          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              The fastest product
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              catalog ever built
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/50 leading-relaxed">
            Browse 200,000+ products with zero duplicates, zero missing records, and instant
            infinite scroll — powered by cursor-based pagination and Neon PostgreSQL.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/products" className="flex items-center gap-2">
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                  <Skeleton className="mb-2 h-4 w-28" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))
            ) : (
              <>
                <StatCard
                  label="Total Products"
                  value={stats ? formatCompact(stats.totalProducts) : '—'}
                  icon={Package}
                  gradient="from-violet-500 to-indigo-500"
                  delay={0.1}
                />
                <StatCard
                  label="Categories"
                  value={stats ? String(stats.categories) : '—'}
                  icon={Layers}
                  gradient="from-blue-500 to-cyan-500"
                  delay={0.2}
                />
                <StatCard
                  label="Database Size"
                  value={stats?.dbSize ?? '—'}
                  icon={Database}
                  gradient="from-emerald-500 to-green-500"
                  delay={0.3}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-10 text-center text-2xl font-bold text-white"
          >
            Built for scale
          </motion.h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 hover:border-white/[0.16] hover:bg-white/[0.06] transition-all duration-300"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} shadow-lg`}
                >
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
