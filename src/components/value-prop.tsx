export function ValueProp() {
  return (
    <section className="bg-beige-light py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-2xl bg-beige-dark">
            <div className="flex h-64 items-center justify-center text-stone-500 md:h-80 lg:h-96">
              <div className="text-center">
                <div className="text-6xl">🚐</div>
                <p className="mt-4 text-sm font-medium">Vehicle Image</p>
              </div>
            </div>
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
