import { MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const counties = [
  'Harris County',
  'Fort Bend County',
  'Montgomery County',
  'Brazoria County',
  'Galveston County',
  'Waller County',
];

export function PricingArea() {
  return (
    <section id="pricing" className="bg-beige-light py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Card className="border-0 bg-dark-card shadow-xl">
            <CardContent className="p-8">
              <h2 className="font-serif text-3xl text-white">
                Transparent Pricing
              </h2>
              <p className="mt-4 text-lg text-stone-200">
                Know your fare before you ride. No hidden fees, no surprises.
              </p>
              <p className="mt-4 text-stone-300">
                We believe in honest, upfront pricing. Call us for a quote
                tailored to your specific transportation needs.
              </p>
              <Button
                asChild
                className="mt-8 bg-amber-400 text-zinc-900 hover:bg-amber-300"
                size="lg"
              >
                <a href="tel:832-598-4858" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Call for Quote
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-beige shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-6 w-6 text-amber-600" />
                <div>
                  <h2 className="font-serif text-3xl text-zinc-900">
                    Service Area
                  </h2>
                  <p className="mt-2 text-lg text-zinc-600">
                    Servicing the Greater Houston Area
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {counties.map((county) => (
                  <div
                    key={county}
                    className="rounded-lg bg-beige-light px-4 py-2 text-sm font-medium text-zinc-700"
                  >
                    {county}
                  </div>
                ))}
              </div>

              <div className="mt-8 overflow-hidden rounded-xl bg-beige-dark">
                <div className="flex h-48 items-center justify-center text-stone-500">
                  <div className="text-center">
                    <div className="text-4xl">🗺️</div>
                    <p className="mt-2 text-sm font-medium">Houston Area Map</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
