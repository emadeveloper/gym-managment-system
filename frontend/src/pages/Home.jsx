import { Suspense, lazy } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/layout/HeroSection';

const TrainingPrograms = lazy(() => import('../components/layout/TrainingPrograms'));
const Testimonials = lazy(() => import('../components/layout/Testimonials'));
const Plans = lazy(() => import('../components/layout/Plans'));
const AboutSection = lazy(() => import('../components/layout/About'));

function SectionFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-40 rounded-3xl border border-gray-800 bg-surface/70" />
    </div>
  );
}

export function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <Suspense fallback={<SectionFallback />}>
          <TrainingPrograms />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Plans />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <AboutSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
