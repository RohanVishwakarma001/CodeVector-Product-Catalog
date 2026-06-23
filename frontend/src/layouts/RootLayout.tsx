import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function RootLayout() {
  return (
    <div className="relative min-h-screen bg-[#030305] text-white">
      <AnimatedBackground />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
