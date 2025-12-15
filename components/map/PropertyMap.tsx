"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Maximize, ChevronLeft, ChevronRight } from "lucide-react";
import type { NainaHubProperty } from "@/lib/nainahub";

// Fix Leaflet default icon issue
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

// Create custom marker with count badge
const createCustomIcon = (count: number) => {
  if (typeof window === "undefined") return null;

  const html = count > 1
    ? `<div style="position: relative;">
        <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" style="width: 32px; height: 32px;" />
        <div style="position: absolute; top: -8px; right: -8px; background: #C9A227; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; border: 2px solid white;">${count}</div>
      </div>`
    : `<img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" style="width: 32px; height: 32px;" />`;

  return new L.DivIcon({
    html,
    className: 'custom-marker-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Custom marker icon (fallback)
const customIcon = typeof window !== "undefined" ? new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
}) : null;

// Helper function to validate coordinates
const isValidCoordinate = (lat: number | null | undefined, lng: number | null | undefined): boolean => {
  return (
    lat !== null &&
    lat !== undefined &&
    lng !== null &&
    lng !== undefined &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    isFinite(lat) &&
    isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

// Component to update map view with smooth animation
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    // Only update if coordinates are valid
    if (
      center &&
      Array.isArray(center) &&
      center.length === 2 &&
      typeof center[0] === 'number' &&
      typeof center[1] === 'number' &&
      !isNaN(center[0]) &&
      !isNaN(center[1]) &&
      isFinite(center[0]) &&
      isFinite(center[1]) &&
      center[0] >= -90 &&
      center[0] <= 90 &&
      center[1] >= -180 &&
      center[1] <= 180
    ) {
      // Use flyTo for smooth animated transition
      map.flyTo(center, zoom, {
        duration: 1.5, // Animation duration in seconds
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);
  return null;
}

interface PropertyMapProps {
  properties: NainaHubProperty[];
  center: [number, number];
  zoom: number;
  formatPrice: (price: number | null) => string | null;
  getSize: (property: NainaHubProperty) => string;
  t: (key: string) => string;
}

// Component to display multiple properties in popup
function MultiPropertyPopup({
  properties,
  formatPrice,
  getSize,
  t,
}: {
  properties: NainaHubProperty[];
  formatPrice: (price: number | null) => string | null;
  getSize: (property: NainaHubProperty) => string;
  t: (key: string) => string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const property = properties[currentIndex];

  return (
    <div className="w-56">
      {properties.length > 1 && (
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
          <span className="text-xs font-semibold text-gray-700">
            {currentIndex + 1} / {properties.length} {t("common.properties")}
          </span>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev > 0 ? prev - 1 : properties.length - 1));
              }}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={properties.length <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev < properties.length - 1 ? prev + 1 : 0));
              }}
              className="p-1 hover:bg-gray-100 rounded"
              disabled={properties.length <= 1}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {property.imageUrls && property.imageUrls[0] && (
        <div className="relative h-32 mb-2">
          <Image
            src={property.imageUrls[0]}
            alt={property.propertyTitleEn}
            fill
            className="object-cover rounded"
          />
        </div>
      )}
      <h3 className="font-semibold text-sm mb-1">
        {property.propertyTitleTh || property.propertyTitleEn}
      </h3>
      <p className="text-xs text-gray-600 mb-2">
        {property.project?.projectNameTh || property.project?.projectNameEn}
      </p>
      <p className="font-bold text-[#C9A227] text-sm mb-2">
        {property.rentalRateNum && property.rentalRateNum > 0
          ? `฿${formatPrice(property.rentalRateNum)}/month`
          : property.sellPriceNum && property.sellPriceNum > 0
          ? `฿${formatPrice(property.sellPriceNum)}`
          : t("common.contactForPrice")}
      </p>
      <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
        <span className="flex items-center gap-1">
          <Bed className="w-3 h-3" />
          {property.bedRoomNum}
        </span>
        <span className="flex items-center gap-1">
          <Bath className="w-3 h-3" />
          {property.bathRoomNum}
        </span>
        <span className="flex items-center gap-1">
          <Maximize className="w-3 h-3" />
          {getSize(property)} sqm
        </span>
      </div>
      <Link href={`/property/${property.id}`} target="_blank">
        <Button size="sm" className="w-full bg-[#C9A227] hover:bg-[#A8841F] text-white">
          {t("common.viewDetails")}
        </Button>
      </Link>
    </div>
  );
}

export default function PropertyMap({
  properties,
  center,
  zoom,
  formatPrice,
  getSize,
  t,
}: PropertyMapProps) {
  if (!customIcon) return null;

  // Validate center coordinates to prevent NaN errors
  const isCenterValid =
    center &&
    Array.isArray(center) &&
    center.length === 2 &&
    isValidCoordinate(center[0], center[1]);

  const validCenter: [number, number] = isCenterValid
    ? center
    : [18.7883, 98.9853]; // Default to Chiang Mai center

  // Group properties by coordinates
  const groupedProperties = properties
    .filter((p) => {
      // Filter logic: check if property has valid coordinates
      if (p.propertyType === "Condo") {
        return isValidCoordinate(p.project?.projectLatitude, p.project?.projectLongitude);
      }
      return isValidCoordinate(p.latitude, p.longitude);
    })
    .reduce((acc, property) => {
      // Determine which coordinates to use based on property type
      let lat: number;
      let lng: number;

      if (
        property.propertyType === "Condo" &&
        isValidCoordinate(property.project?.projectLatitude, property.project?.projectLongitude)
      ) {
        lat = property.project!.projectLatitude!;
        lng = property.project!.projectLongitude!;
      } else if (isValidCoordinate(property.latitude, property.longitude)) {
        lat = property.latitude!;
        lng = property.longitude!;
      } else {
        // Skip properties without valid coordinates
        return acc;
      }

      const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
      if (!acc[key]) {
        acc[key] = { lat, lng, properties: [] };
      }
      acc[key].properties.push(property);
      return acc;
    }, {} as Record<string, { lat: number; lng: number; properties: NainaHubProperty[] }>);

  return (
    <MapContainer
      center={validCenter}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      <MapUpdater center={validCenter} zoom={zoom} />

      {Object.entries(groupedProperties).map(([key, group]) => {
        // Final safety check before rendering marker
        if (!isValidCoordinate(group.lat, group.lng)) {
          return null;
        }
        const icon = createCustomIcon(group.properties.length);
        return (
          <Marker
            key={key}
            position={[group.lat, group.lng]}
            icon={icon || customIcon}
          >
            <Popup maxWidth={300}>
              <MultiPropertyPopup
                properties={group.properties}
                formatPrice={formatPrice}
                getSize={getSize}
                t={t}
              />
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
