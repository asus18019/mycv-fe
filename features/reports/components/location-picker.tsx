"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { APIProvider, Map, Marker, type MapMouseEvent } from "@vis.gl/react-google-maps";
import { cn } from "@/lib/utils";

const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 };

interface LocationPickerProps {
  lat: number | undefined;
  lng: number | undefined;
  onChange: (lat: number, lng: number) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
}

export function LocationPicker({ lat, lng, onChange, expanded, onToggleExpanded }: LocationPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const position = lat !== undefined && lng !== undefined ? { lat, lng } : undefined;

  if (!apiKey) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-zinc-300 text-sm text-zinc-400">
        Map unavailable — missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      </div>
    );
  }

  function handleMapClick(e: MapMouseEvent) {
    if (!e.detail.latLng) return;
    onChange(e.detail.latLng.lat, e.detail.latLng.lng);
  }

  function handleMarkerDragEnd(e: google.maps.MapMouseEvent) {
    if (!e.latLng) return;
    onChange(e.latLng.lat(), e.latLng.lng());
  }

  return (
    <div className="relative">
      <APIProvider apiKey={apiKey}>
        <Map
          className={cn("w-full overflow-hidden rounded-md", expanded ? "h-128" : "h-64")}
          defaultCenter={position ?? DEFAULT_CENTER}
          defaultZoom={position ? 12 : 4}
          gestureHandling="greedy"
          disableDefaultUI
          onClick={handleMapClick}
        >
          {position && <Marker position={position} draggable onDragEnd={handleMarkerDragEnd} />}
        </Map>
      </APIProvider>
      <button
        type="button"
        onClick={onToggleExpanded}
        className="absolute right-2 top-2 z-10 flex cursor-pointer items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-600 shadow-sm hover:bg-zinc-50"
      >
        {expanded ? (
          <>
            <Minimize2 className="size-3.5" />
            Collapse map
          </>
        ) : (
          <>
            <Maximize2 className="size-3.5" />
            Expand map
          </>
        )}
      </button>
    </div>
  );
}