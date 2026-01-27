import { BookingForm } from '@/components/booking/booking-form';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';

export default function BookingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-beige">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-2xl border-0 bg-dark-card shadow-xl">
          <CardContent className="p-8">
            <h1 className="mb-6 text-center font-serif text-3xl font-normal text-white md:text-4xl">
              Book Your Ride
            </h1>
            <BookingForm />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
