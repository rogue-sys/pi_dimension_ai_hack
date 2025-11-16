"use client";

import { Card } from "@/components/ui/card";
import { MapPin, LocateFixed } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const FlyToButton = dynamic(
  () =>
    import("react-leaflet").then(({ useMap }) => {
      return function FlyButton({ lat, lng }: { lat: number; lng: number }) {
        const map = useMap();

        return (
          <button
            onClick={() => map.flyTo([lat, lng], 14, { duration: 1.2 })}
            className="absolute z-[999] top-3 right-3 bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded flex items-center gap-2 shadow-md"
          >
            <LocateFixed className="w-4 h-4" />
            Go to Point
          </button>
        );
      };
    }),
  { ssr: false }
);

export default function RealityLocation({
  coordinates,
}: {
  coordinates: string;
}) {
  const [L, setL] = useState<any>(null);
  const [DefaultIcon, setDefaultIcon] = useState<any>(null);

  const [lat, lng] = coordinates.split(",").map(Number);

  useEffect(() => {
    (async () => {
      const leaflet = await import("leaflet");

      const icon = leaflet.icon({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      setL(leaflet);
      setDefaultIcon(icon);
    })();
  }, []);

  if (!L || !DefaultIcon) return null;

  return (
    <Card className="bg-[#12071c] border-purple-800/40 gap-2 p-5">
      <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
        <MapPin className="w-5 h-5 " />
        Location & Coordinates
      </h3>

      <motion.div
        className="relative mt-4 h-52 rounded-xl overflow-hidden border border-purple-700/40"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          scrollWheelZoom={true}
          dragging={true}
          zoomControl={true}
          className="w-full h-full rounded-xl"
        >
          <FlyToButton lat={lat} lng={lng} />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <Marker position={[lat, lng]} icon={DefaultIcon}>
            <Popup>
              Coordinates: <br /> {lat}, {lng}
            </Popup>
          </Marker>
        </MapContainer>
      </motion.div>

      <p className="mt-4 text-purple-300">{coordinates}</p>
    </Card>
  );
}
