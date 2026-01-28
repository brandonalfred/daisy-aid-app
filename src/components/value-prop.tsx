import Image from 'next/image';

export function ValueProp() {
  return (
    <section className="bg-beige-light py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative h-64 overflow-hidden rounded-2xl bg-beige-dark md:h-80 lg:h-96">
            <Image
              src="/vehicle.webp"
              alt="Reliable vehicle for medical transportation"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="font-serif text-2xl leading-relaxed text-zinc-700 md:text-3xl">
              Reliable vehicle solutions engineered to keep you moving forward
              to your medically-related appointment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
