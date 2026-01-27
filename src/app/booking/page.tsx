import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';

export default function BookingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-beige">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md border-0 bg-dark-card shadow-xl">
          <CardContent className="p-8 text-center">
            <h1 className="font-serif text-3xl font-normal text-white md:text-4xl">
              Book Your Trip
            </h1>
            <p className="mt-4 text-lg text-stone-300">Coming soon</p>
            <p className="mt-6 text-stone-200">
              In the meantime, call us at{' '}
              <a
                href="tel:832-598-4858"
                className="font-bold text-white hover:underline"
              >
                832-598-4858
              </a>{' '}
              to schedule your trip.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
