'use client';

import { format } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CALENDAR_CONFIG, formatSlotTime } from '@/lib/booking-config';
import { AddressInput } from './address-input';
import { DatePicker } from './date-picker';
import { TimeSlotPicker } from './time-slot-picker';

const { timezone: TIMEZONE } = CALENDAR_CONFIG;

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupAddress: string;
  dropoffAddress: string;
}

type Step = 'date' | 'time' | 'details' | 'confirmation';

export function BookingForm() {
  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pickupAddress: '',
    dropoffAddress: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep('time');
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setStep('details');
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;

    setSubmitting(true);
    setError(null);

    try {
      const [hours, minutes] = selectedSlot.split(':').map(Number);
      const appointmentDateCST = new Date(selectedDate);
      appointmentDateCST.setHours(hours, minutes, 0, 0);
      const appointmentUTC = fromZonedTime(appointmentDateCST, TIMEZONE);

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          appointmentStart: appointmentUTC.toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      setBookingId(data.booking.id);
      setStep('confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const formatSlotDisplay = (slot: string): string =>
    `${formatSlotTime(slot)} CST`;

  if (step === 'confirmation') {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            role="img"
            aria-label="Success checkmark"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-white">Booking Confirmed!</h2>
        <p className="text-stone-300">
          Your ride has been scheduled for{' '}
          <span className="font-semibold text-white">
            {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </span>{' '}
          at{' '}
          <span className="font-semibold text-white">
            {selectedSlot && formatSlotDisplay(selectedSlot)}
          </span>
        </p>
        <p className="text-sm text-stone-400">
          Confirmation #{bookingId?.slice(0, 8).toUpperCase()}
        </p>
        <p className="text-stone-300">
          We&apos;ll be in touch shortly to confirm your pickup details. If you
          have questions, call us at{' '}
          <a
            href="tel:832-598-4858"
            className="font-bold text-white hover:underline"
          >
            832-598-4858
          </a>
        </p>
        <Button
          onClick={() => {
            setStep('date');
            setSelectedDate(null);
            setSelectedSlot(null);
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              pickupAddress: '',
              dropoffAddress: '',
            });
            setBookingId(null);
          }}
          variant="outline"
          className="mt-4"
        >
          Book Another Ride
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4 flex items-center justify-between text-sm text-stone-400">
        <span className={step === 'date' ? 'font-semibold text-white' : ''}>
          1. Date
        </span>
        <span className="mx-2">→</span>
        <span className={step === 'time' ? 'font-semibold text-white' : ''}>
          2. Time
        </span>
        <span className="mx-2">→</span>
        <span className={step === 'details' ? 'font-semibold text-white' : ''}>
          3. Details
        </span>
      </div>

      {step === 'date' && (
        <DatePicker
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      )}

      {step === 'time' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              setSelectedSlot(null);
              setStep('date');
            }}
            className="cursor-pointer text-sm text-stone-300 hover:text-white hover:underline"
          >
            ← Back to date selection
          </button>
          {selectedDate && (
            <p className="text-white">
              Selected:{' '}
              <span className="font-semibold">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </span>
            </p>
          )}
          <TimeSlotPicker
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onSlotSelect={handleSlotSelect}
          />
        </div>
      )}

      {step === 'details' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              setSelectedSlot(null);
              setStep('time');
            }}
            className="cursor-pointer text-sm text-stone-300 hover:text-white hover:underline"
          >
            ← Back to time selection
          </button>
          {selectedDate && selectedSlot && (
            <p className="text-white">
              {format(selectedDate, 'EEEE, MMMM d')} at{' '}
              <span className="font-semibold">
                {formatSlotDisplay(selectedSlot)}
              </span>
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-stone-200">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                className="border-stone-600 bg-stone-700 text-white placeholder:text-stone-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-stone-200">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                className="border-stone-600 bg-stone-700 text-white placeholder:text-stone-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-stone-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="border-stone-600 bg-stone-700 text-white placeholder:text-stone-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-stone-200">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="832-555-1234"
              required
              className="border-stone-600 bg-stone-700 text-white placeholder:text-stone-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupAddress" className="text-stone-200">
              Pickup Address
            </Label>
            <AddressInput
              id="pickupAddress"
              value={formData.pickupAddress}
              onChange={(value) => handleInputChange('pickupAddress', value)}
              placeholder="Enter pickup address"
              className="border-stone-600 bg-stone-700 text-white placeholder:text-stone-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoffAddress" className="text-stone-200">
              Dropoff Address
            </Label>
            <AddressInput
              id="dropoffAddress"
              value={formData.dropoffAddress}
              onChange={(value) => handleInputChange('dropoffAddress', value)}
              placeholder="Enter dropoff address"
              className="border-stone-600 bg-stone-700 text-white placeholder:text-stone-400"
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-900/50 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full"
            size="lg"
          >
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </div>
      )}
    </form>
  );
}
