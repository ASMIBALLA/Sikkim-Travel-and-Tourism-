"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet-control-geocoder";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// Fix Leaflet marker icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ------------------ Types ------------------
type LatLng = [number, number];

interface Monastery {
  id: number;
  name: string;
  desc: string;
  visiting: string;
  link: string;
  img: string;
  coordinates: LatLng;
}

interface Festival {
  id: number;
  name: string;
  date: string;
  coordinates: LatLng;
  img: string;
}
// Example monastery data
const monasteries = [
    {
    id: 1,
    name: "Rumtek Monastery",
    town: "Gangtok",
    desc: "Seat-in-exile of the Karmapa, near Gangtok.",
    visiting: "Open: 9 AM – 6 PM",
    link: "https://rumtek.org/",
    img: "/beautiful-himalayan-monastery-with-golden-roofs-an.jpg",
    coordinates: [27.3258, 88.6012],
  },
  {
    id: 2,
    name: "Pemayangtse Monastery",
    town: "Pelling",
    desc: "Historic Nyingma monastery near Pelling.",
    visiting: "Open: 9 AM – 5 PM",
    link: "https://www.sikkimstdc.com/",
    img: "/ancient-tibetan-monastery-interior-with-wooden-scu.jpg",
    coordinates: [27.30453, 88.25204],
  },
  {
    id: 3,
    name: "Tashiding Monastery",
    town: "Tashiding",
    desc: "Pilgrimage site known for Bumchu's sacred water ritual.",
    visiting: "Open: 8 AM – 5 PM",
    link: "https://www.sikkimtourism.gov.in/",
    img: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Tashiding_Monastery_Sikkim.jpg",
    coordinates: [27.274, 88.287],
  },
  {
    id: 4,
    name: "Enchey Monastery",
    town: "Gangtok",
    desc: "A 200-year-old monastery with rich murals and ceremonies.",
    visiting: "Open: 9 AM – 6 PM",
    link: "https://www.sikkimtourism.gov.in/",
    img: "https://upload.wikimedia.org/wikipedia/commons/2/29/Enchey_Monastery_Gangtok.jpg",
    coordinates: [27.3381, 88.6132],
  },
  {
    id: 5,
    name: "Ralang Monastery",
    town: "Ralang",
    desc: "Known for its stunning architecture and prayer halls.",
    visiting: "Open: 8 AM – 5 PM",
    link: "https://www.sikkimtourism.gov.in/",
    img: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Ralang_Monastery.jpg",
    coordinates: [27.1675, 88.6622],
  },
  {
    id: 6,
    name: "Phodong Monastery",
    town: "Phodong",
    desc: "Seat of the Nyingma sect with rich cultural heritage.",
    visiting: "Open: 9 AM – 5 PM",
    link: "https://www.sikkimtourism.gov.in/",
    img: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Phodong_Monastery_Sikkim.jpg",
    coordinates: [27.428, 88.613],
  },
];



// Layer for markers with clustering
function MonasteriesLayer({ data, onSelect }: { data: typeof monasteries; onSelect: (item: any) => void }) {
  const map = useMap();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!map) return;

    if (clusterRef.current) {
      clusterRef.current.remove();
      clusterRef.current = null;
    }

    const markers = L.markerClusterGroup();

    data.forEach((m) => {
      // Make sure coordinates are [lat, lng]
      const coords: [number, number] = [m.coordinates[0], m.coordinates[1]];
      const marker = L.marker(coords); // explicit type

      // ✅ Bind hover tooltip
      const tooltipHtml = `
        <div class="text-center max-w-xs">
          <h3 class="font-bold text-sm mb-1">${m.name}</h3>
          <img src="${m.img}" alt="${m.name}" class="w-24 h-16 object-cover rounded mb-1"/>
          <p class="text-xs mb-1">${m.desc}</p>
          <p class="text-xs font-semibold">${m.visiting}</p>
          <p class="text-xs text-gray-600">${m.town || ""}</p>
        </div>
      `;
      marker.bindTooltip(tooltipHtml, {
        direction: "top",
        offset: [0, -10],
        className: "custom-tooltip", // optional for Tailwind styling
        permanent: false, // shows only on hover
      });

      // Click opens your Shadcn card
      marker.on("click", () => onSelect(m));

      markers.addLayer(marker);
    });



    markers.addTo(map);
    clusterRef.current = markers;

    // Fit bounds
    try {
      const bounds = markers.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds.pad(0.25));
    } catch {
      map.setView([27.35, 88.45], 9);
    }

    // Search control
    
    const geocoder = (L.Control as any).geocoder({ defaultMarkGeocode: false })
      .on("markgeocode", function (e: any) {
        const bbox = e.geocode.bbox;
        map.fitBounds(bbox);
      })
      .addTo(map);

    return () => {
      if (clusterRef.current) {
        clusterRef.current.remove();
        clusterRef.current = null;
      }
      map.removeControl(geocoder);
    };
  }, [map, data, onSelect]);

  return null;
}

export default function InteractiveMap({ height = "80vh" }: { height?: string }) {
  const [selected, setSelected] = useState<any | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div className="relative w-full rounded-2xl shadow-lg overflow-hidden" style={{ height }}>
      <MapContainer
        center={[27.35, 88.45]}
        zoom={9}
        style={{ width: "100%", height: "100%" }}
        whenCreated={(mapInstance: L.Map) => {
          mapRef.current = mapInstance;

          // GPX export button
          const exportButton = new (L.Control.extend({
            onAdd: function () {
              const div = L.DomUtil.create(
                "div",
                "leaflet-bar p-2 bg-white rounded shadow cursor-pointer"
              );
              div.innerHTML = "⬇ GPX";
              div.onclick = () => {
                const gpx = `<?xml version="1.0"?><gpx version="1.1" creator="Monastery360"><trk><name>Monastery Route</name><trkseg>${monasteries
                  .map(
                    (m) =>
                      `<trkpt lat="${m.coordinates[0]}" lon="${m.coordinates[1]}"></trkpt>`
                  )
                  .join("\n")}</trkseg></trk></gpx>`;
                const blob = new Blob([gpx], { type: "application/gpx+xml" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "monasteries.gpx";
                a.click();
                URL.revokeObjectURL(url);
              };
              return div;
            },
          }))({ position: "topright" });

          exportButton.addTo(mapInstance);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MonasteriesLayer data={monasteries} onSelect={setSelected} />
      </MapContainer>
      {/* Floating card for selected monastery */}
      {selected && (
        <Card className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-sm border-0 shadow-xl z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-2xl w-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Image section */}
            {selected.img && (
              <img
                src={selected.img}
                alt={selected.name}
                className="rounded-lg w-full md:w-1/2 h-auto object-contain"
              />
            )}

            {/* Info section */}
            <div className="flex-1">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{selected.town}</p>
                  <p className="text-muted-foreground mb-1">{selected.desc}</p>
                  <p className="text-sm font-medium">{selected.visiting}</p>
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    More Info
                  </a>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Coordinates */}
              <Badge className="mt-3">{selected.coordinates.join(", ")}</Badge>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}