import { useEffect, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";

import { cn } from "@shared/lib/utils";
import { Input } from "./input";
import { Button } from "./button";

interface YandexMapPickerProps {
  onLocationSelect: (coordinates: { lat: number; lon: number }, address?: string) => void;
  initialCoordinates?: { lat: number; lon: number };
  className?: string;
}

declare global {
  interface Window {
    ymaps: any;
    __ymapsLoading?: Promise<void>;
  }
}

export const YandexMapPicker = ({
  onLocationSelect,
  initialCoordinates,
  className
}: YandexMapPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const placemarkRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [addressInput, setAddressInput] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (mapLoaded) return;

    const apiKey = import.meta.env.YANDEX_API_KEY || import.meta.env.VITE_YANDEX_API_KEY;
    if (!apiKey) {
      console.error("Yandex Maps API key is not set. Please set YANDEX_API_KEY in .env file");
      return;
    }

    const ensureScript = () => {
      if (window.ymaps) return Promise.resolve();
      if (!window.__ymapsLoading) {
        window.__ymapsLoading = new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      return window.__ymapsLoading;
    };

    ensureScript()
      .then(() => {
        if (window.ymaps && mapRef.current && !mapLoaded) {
          initializeMap();
        }
      })
      .catch((err) => {
        console.error("Failed to load Yandex Maps script", err);
      });
  }, [mapLoaded]);

  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current && initialCoordinates) {
      mapInstanceRef.current.setCenter([initialCoordinates.lat, initialCoordinates.lon], 10);
      if (placemarkRef.current) {
        placemarkRef.current.geometry.setCoordinates([initialCoordinates.lat, initialCoordinates.lon]);
      }
    }
  }, [mapLoaded, initialCoordinates]);

  const initializeMap = () => {
    if (!window.ymaps || !mapRef.current || mapLoaded) return;

    window.ymaps.ready(() => {
      const defaultCenter = initialCoordinates
        ? [initialCoordinates.lat, initialCoordinates.lon]
        : [55.751574, 37.573856];

      const map = new window.ymaps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 10,
        controls: ["zoomControl", "fullscreenControl"]
      });

      mapInstanceRef.current = map;
      let currentPlacemark: any = null;

      if (initialCoordinates) {
        currentPlacemark = new window.ymaps.Placemark(
          [initialCoordinates.lat, initialCoordinates.lon],
          {},
          {
            draggable: true
          }
        );
        map.geoObjects.add(currentPlacemark);
        placemarkRef.current = currentPlacemark;
      }

      map.events.add("click", (e: any) => {
        const coords = e.get("coords");

        if (currentPlacemark) {
          currentPlacemark.geometry.setCoordinates(coords);
        } else {
          currentPlacemark = new window.ymaps.Placemark(
            coords,
            {},
            {
              draggable: true
            }
          );
          map.geoObjects.add(currentPlacemark);
          placemarkRef.current = currentPlacemark;
        }

        window.ymaps.geocode(coords).then((res: any) => {
          const firstGeoObject = res.geoObjects.get(0);
          const addr = firstGeoObject
            ? firstGeoObject.getAddressLine()
            : `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
          setAddress(addr);
          setAddressInput(addr);
          onLocationSelect({ lat: coords[0], lon: coords[1] }, addr);
        });
      });

      if (currentPlacemark) {
        currentPlacemark.events.add("dragend", () => {
          const coords = currentPlacemark.geometry.getCoordinates();
          window.ymaps.geocode(coords).then((res: any) => {
            const firstGeoObject = res.geoObjects.get(0);
            const addr = firstGeoObject
              ? firstGeoObject.getAddressLine()
              : `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
            setAddress(addr);
            setAddressInput(addr);
            onLocationSelect({ lat: coords[0], lon: coords[1] }, addr);
          });
        });
      }

      setMapLoaded(true);
    });
  };

  const handleAddressSearch = () => {
    if (!addressInput.trim() || !window.ymaps || !mapInstanceRef.current) return;

    setIsSearching(true);
    window.ymaps.geocode(addressInput).then((res: any) => {
      const firstGeoObject = res.geoObjects.get(0);
      if (firstGeoObject) {
        const coords = firstGeoObject.geometry.getCoordinates();
        const addr = firstGeoObject.getAddressLine();

        mapInstanceRef.current.setCenter(coords, 15);

        if (placemarkRef.current) {
          placemarkRef.current.geometry.setCoordinates(coords);
        } else {
          const placemark = new window.ymaps.Placemark(
            coords,
            {},
            {
              draggable: true
            }
          );
          placemark.events.add("dragend", () => {
            const newCoords = placemark.geometry.getCoordinates();
            window.ymaps.geocode(newCoords).then((geoRes: any) => {
              const geoObject = geoRes.geoObjects.get(0);
              const newAddr = geoObject
                ? geoObject.getAddressLine()
                : `${newCoords[0].toFixed(6)}, ${newCoords[1].toFixed(6)}`;
              setAddress(newAddr);
              setAddressInput(newAddr);
              onLocationSelect({ lat: newCoords[0], lon: newCoords[1] }, newAddr);
            });
          });
          mapInstanceRef.current.geoObjects.add(placemark);
          placemarkRef.current = placemark;
        }

        setAddress(addr);
        onLocationSelect({ lat: coords[0], lon: coords[1] }, addr);
      } else {
        console.error("Адрес не найден");
      }
      setIsSearching(false);
    });
  };

  const handleAddressKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddressSearch();
    }
  };


  return (
    <div className={cn("space-y-2", className)}>
      <div className='flex gap-2'>
        <div className='flex-1'>
          <Input
            placeholder='Введите адрес или кликните на карте'
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            onKeyPress={handleAddressKeyPress}
          />
        </div>
        <Button
          type='button'
          onClick={handleAddressSearch}
          disabled={isSearching || !addressInput.trim()}
          size='icon'
        >
          <Search className='h-4 w-4' />
        </Button>
      </div>
      <div ref={mapRef} className='h-64 w-full rounded-md border' />
      {address && (
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <MapPin className='h-4 w-4' />
          <span>{address}</span>
        </div>
      )}
      <p className='text-xs text-muted-foreground'>
        Введите адрес или кликните на карте, чтобы выбрать место проведения события
      </p>
    </div>
  );
};

