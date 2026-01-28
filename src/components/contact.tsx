'use client';

import { Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/daisyaidtransport',
    icon: Instagram,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/daisy-aid-transport-llc/',
    icon: Linkedin,
  },
];

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="bg-beige py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center">
          <h2 className="font-serif text-4xl text-zinc-900 md:text-5xl">
            Get in Touch
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Ready to schedule a ride? Contact us today.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Card className="border-0 bg-beige-light">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl text-zinc-900">
                Contact Information
              </h3>

              <div className="mt-6 space-y-4">
                <a
                  href="tel:832-598-4858"
                  className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-beige"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <Phone className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Phone</p>
                    <p className="text-lg font-medium text-zinc-900">
                      832-598-4858
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:info@daisyaidtransport.com"
                  className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-beige"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <Mail className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Email</p>
                    <p className="text-lg font-medium text-zinc-900 break-all">
                      info@daisyaidtransport.com
                    </p>
                  </div>
                </a>
              </div>

              <div className="mt-8 border-t border-beige-dark pt-8">
                <p className="text-sm font-medium text-zinc-500">Follow Us</p>
                <div className="mt-4 flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-beige-dark bg-beige text-zinc-600 transition-colors hover:border-amber-400 hover:text-zinc-900"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-beige-light">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl text-zinc-900">
                Send Us a Message
              </h3>

              {submitted ? (
                <div className="mt-6 rounded-lg bg-green-50 p-6 text-center">
                  <p className="text-lg font-medium text-green-800">
                    Thank you for your message!
                  </p>
                  <p className="mt-2 text-green-700">
                    We&apos;ll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-zinc-700"
                      >
                        Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        className="border-beige-dark bg-beige"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-zinc-700"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="border-beige-dark bg-beige"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium text-zinc-700"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="How can we help?"
                      className="border-beige-dark bg-beige"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-zinc-700"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Your message..."
                      rows={4}
                      className="border-beige-dark bg-beige"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="cta"
                    size="lg"
                    className="w-full"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
