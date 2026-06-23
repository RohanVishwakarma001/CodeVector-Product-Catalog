import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
];

export function Navbar() {
  const location = useLocation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow duration-300">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            Code<span className="text-violet-400">Vector</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                  isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-white/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  {label === 'Products' && <ShoppingBag className="h-3.5 w-3.5" />}
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
