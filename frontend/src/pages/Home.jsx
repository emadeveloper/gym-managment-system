import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/layout/HeroSection';
import Plans from '../components/layout/Plans';
import TrainingPrograms from '../components/layout/TrainingPrograms';
import Products from '../components/layout/Products';
import Testimonials from '../components/layout/Testimonials';
import AboutSection from '../components/layout/About';

export function Home() {
  return (
    <div className="min-h-screen ">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <main className="">
        <HeroSection path="/home"/>
        {/* Training Programs Section */}
        <TrainingPrograms path="/training"/>
        {/* Testimonials Section */}
        <Testimonials path="/testimonials"/>
        {/* Plans Section */}
        <Plans path="/plans"/>
        {/* <Products /> Products - Temporarily disabled */}
        {/* About */}
        <AboutSection path="/about"/>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}