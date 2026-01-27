'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

interface AddressInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

declare global {
  interface Window {
    google?: typeof google;
    initGooglePlaces?: () => void;
  }
}

let isScriptLoading = false;
let isScriptLoaded = false;
const callbacks: (() => void)[] = [];

function loadGooglePlacesScript(apiKey: string): Promise<void> {
  return new Promise((resolve) => {
    if (isScriptLoaded && window.google?.maps?.places) {
      resolve();
      return;
    }

    callbacks.push(resolve);

    if (isScriptLoading) return;
    isScriptLoading = true;

    window.initGooglePlaces = () => {
      isScriptLoaded = true;
      for (const cb of callbacks) {
        cb();
      }
      callbacks.length = 0;
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGooglePlaces`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
}

export function AddressInput({
  id,
  value,
  onChange,
  placeholder,
  className,
}: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.warn('Google Places API key not configured');
      return;
    }

    loadGooglePlacesScript(apiKey).then(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;
    if (!window.google?.maps?.places) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        componentRestrictions: { country: 'us' },
        fields: ['formatted_address'],
        types: ['address'],
      }
    );

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.formatted_address) {
        onChange(place.formatted_address);
      }
    });
  }, [isLoaded, onChange]);

  return (
    <Input
      ref={inputRef}
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      autoComplete="off"
    />
  );
}
