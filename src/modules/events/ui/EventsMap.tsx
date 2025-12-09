import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

import type { Event } from "@modules/events/types/event";
import { cn } from "@shared/lib/utils";

interface EventsMapProps {
  events: Event[];
  className?: string;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

export const EventsMap = ({ events, className }: EventsMapProps) => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const placemarksRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const eventsWithCoordinates = events.filter((event) => event.coordinates && event.status !== "declined");

  useEffect(() => {
    if (!window.ymaps) {
      const apiKey = import.meta.env.YANDEX_API_KEY || import.meta.env.VITE_YANDEX_API_KEY;
      if (!apiKey) {
        console.error("Yandex Maps API key is not set. Please set YANDEX_API_KEY in .env file");
        return;
      }

      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        if (window.ymaps && mapRef.current) {
          initializeMap();
        }
      };
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    } else if (window.ymaps && mapRef.current && !mapLoaded) {
      initializeMap();
    }
  }, [mapLoaded]);

  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current && eventsWithCoordinates.length > 0) {
      updatePlacemarks();
    }
  }, [events, mapLoaded]);

  const initializeMap = () => {
    if (!window.ymaps || !mapRef.current || mapLoaded) return;

    window.ymaps.ready(() => {
      const defaultCenter = [47.235, 38.896];
      const map = new window.ymaps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
        controls: ["zoomControl", "fullscreenControl", "typeSelector"]
      });

      mapInstanceRef.current = map;
      setMapLoaded(true);

      if (eventsWithCoordinates.length > 0) {
        updatePlacemarks();
      }
    });
  };

  const updatePlacemarks = () => {
    if (!window.ymaps || !mapInstanceRef.current) return;

    placemarksRef.current.forEach((placemark) => {
      mapInstanceRef.current.geoObjects.remove(placemark);
    });
    placemarksRef.current = [];

    eventsWithCoordinates.forEach((event) => {
      if (!event.coordinates) return;

      const statusColors: Record<string, string> = {
        active: "#10b981",
        past: "#6b7280",
        declined: "#ef4444"
      };

      const color = statusColors[event.status] || "#3b82f6";

      const placemark = new window.ymaps.Placemark(
        [event.coordinates.lat, event.coordinates.lon],
        {
          balloonContentHeader: `<strong>${event.title}</strong>`,
          balloonContentBody: `
            <div style="margin: 8px 0;">
              <p style="margin: 4px 0; color: #666;">${event.shortDescription}</p>
              ${event.location ? `<p style="margin: 4px 0;"><strong>Место:</strong> ${event.location}</p>` : ""}
              <p style="margin: 4px 0;"><strong>Участников:</strong> ${event.participantsCount}${event.participantsLimit ? ` / ${event.participantsLimit}` : ""}</p>
            </div>
          `,
          balloonContentFooter: `<span style="color: ${color};">${event.status === "active" ? "Активное" : event.status === "past" ? "Прошедшее" : "Отклонено"}</span>`,
          hintContent: `<div style="padding: 4px 8px; font-weight: 500;">${event.title}</div>`
        },
        {
          preset: `islands#${color.replace("#", "")}CircleDotIcon`,
          draggable: false,
          openBalloonOnClick: false
        }
      );

      placemark.events.add("click", () => {
        navigate(`/events/${event.id}`);
      });

      mapInstanceRef.current.geoObjects.add(placemark);
      placemarksRef.current.push(placemark);
    });

    if (eventsWithCoordinates.length > 0) {
      const bounds = eventsWithCoordinates
        .map((event) => [event.coordinates!.lat, event.coordinates!.lon])
        .filter((coords) => coords[0] && coords[1]);

      if (bounds.length > 0) {
        mapInstanceRef.current.setBounds(bounds, {
          checkZoomRange: true,
          duration: 300
        });
      }
    }
  };

  if (eventsWithCoordinates.length === 0) {
    return (
      <div className={cn("flex h-96 items-center justify-center rounded-lg border bg-muted/40", className)}>
        <div className='text-center text-muted-foreground'>
          <MapPin className='mx-auto h-8 w-8 mb-2 opacity-50' />
          <p className='text-sm'>Нет событий с указанными координатами</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div ref={mapRef} className='h-96 w-full rounded-lg border' />
      <p className='text-xs text-muted-foreground'>
        На карте отображено {eventsWithCoordinates.length} событи{eventsWithCoordinates.length === 1 ? "е" : "я"}. Кликните на метку для просмотра деталей.
      </p>
    </div>
  );
};

