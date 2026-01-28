import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function Hero() {
  return (
    <section className="bg-beige py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h1 className="font-serif text-5xl font-normal tracking-tight text-zinc-900 md:text-6xl lg:text-7xl">
              Daisy Aid Transport
            </h1>
            <p className="mt-6 font-serif text-3xl text-zinc-800 md:text-4xl">
              Non-Emergency Medical Transportation (NEMT)
            </p>
            <p className="mt-4 font-serif text-2xl font-semibold text-zinc-900 md:text-3xl">
              Rides for the 55+ Community
            </p>
            <p className="mt-8 font-serif text-2xl italic text-zinc-600 md:text-3xl">
              Compassion in Motion
            </p>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <Card className="w-full max-w-md border-0 bg-dark-card shadow-xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <Button asChild variant="cta" size="lg" className="mb-6">
                    <Link href="/booking">Book Now</Link>
                  </Button>
                  <p className="text-lg text-stone-200">
                    Or call us at{' '}
                    <a
                      href="tel:832-598-4858"
                      className="font-bold text-white hover:underline"
                    >
                      832-598-4858
                    </a>{' '}
                    to schedule your trip.
                  </p>

                  <div className="mt-8 space-y-4 text-stone-200">
                    <p>
                      If you need to{' '}
                      <span className="font-semibold text-white">
                        cancel your appointment
                      </span>
                      , there&apos;s{' '}
                      <span className="font-semibold text-white">
                        no charge
                      </span>{' '}
                      when canceled{' '}
                      <span className="font-semibold text-white">
                        at least 24 hours in advance
                      </span>
                      .
                    </p>

                    <p>
                      Cancellations made{' '}
                      <span className="font-semibold text-white">
                        within 24 hours of your scheduled ride
                      </span>{' '}
                      will incur a{' '}
                      <span className="font-semibold text-white">
                        $3.00 administrative fee
                      </span>
                      .
                    </p>

                    <p className="pt-4 text-stone-300">
                      Thank you for helping us keep our scheduling efficient and
                      fair for all riders.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
