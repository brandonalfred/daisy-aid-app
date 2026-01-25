import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { PricingArea } from '@/components/pricing-area';
import { Services } from '@/components/services';
import { ValueProp } from '@/components/value-prop';

export default function Home() {
  return (
    <div className="min-h-screen bg-beige">
      <Header />
      <main>
        <Hero />
        <ValueProp />
        <Services />
        <PricingArea />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
