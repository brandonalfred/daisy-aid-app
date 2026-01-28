import { Card, CardContent } from '@/components/ui/card';

const serviceImages = [
  { label: 'Medical Facilities', emoji: '🏥' },
  { label: 'Rehabilitation Centers', emoji: '♿' },
  { label: 'Dental Offices', emoji: '🦷' },
];

const serviceTypes = [
  { label: 'Ambulatory', description: 'Walk-on service' },
  { label: 'Companion 16+', description: 'Ride with a companion' },
  { label: 'Wheelchair', description: 'Wheelchair accessible vehicles' },
];

const servicesList = [
  "Doctor's Appointments",
  'Hospital Visits',
  'Dialysis Treatments',
  'Physical Therapy',
  'Pharmacy Trips',
  'Lab Work & Testing',
];

export function Services() {
  return (
    <section id="services" className="bg-beige py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center">
          <h2 className="font-serif text-4xl text-zinc-900 md:text-5xl">
            Services Offered
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {serviceImages.map((service) => (
            <Card
              key={service.label}
              className="overflow-hidden border-0 bg-beige-dark"
            >
              <div className="flex h-48 items-center justify-center text-stone-500">
                <div className="text-center">
                  <div className="text-5xl">{service.emoji}</div>
                  <p className="mt-3 text-sm font-medium">{service.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <Card className="border-0 bg-beige-light">
            <CardContent className="p-6 text-center">
              <div className="font-serif text-5xl text-zinc-800">55+</div>
              <p className="mt-2 text-lg font-medium text-zinc-700">
                Years Old
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                Dedicated service for customers 55 years and older
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-beige-light">
            <CardContent className="p-6 text-center">
              <div className="font-serif text-4xl text-zinc-800">NEMT</div>
              <p className="mt-2 text-lg font-medium text-zinc-700">
                Non-Emergency Medical Transport
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                Safe, reliable medical transportation services
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-beige-light">
            <CardContent className="p-6">
              <p className="text-center text-lg font-medium text-zinc-700">
                We Transport You To:
              </p>
              <ul className="mt-4 space-y-2">
                {servicesList.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-zinc-600"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16">
          <p className="text-center text-sm font-medium uppercase tracking-wide text-zinc-500">
            Service Types Available
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {serviceTypes.map((type, index) => {
              const isLast = index === serviceTypes.length - 1;
              return (
                <div key={type.label} className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-serif text-xl text-zinc-800">
                      {type.label}
                    </p>
                    <p className="text-sm text-zinc-500">{type.description}</p>
                  </div>
                  {!isLast && (
                    <div className="hidden h-12 w-px bg-zinc-300 md:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
