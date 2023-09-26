'use client';
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  scrollWheelZoom: boolean;
  zoomControl: boolean;
  tileLayerUrl: string;
  tileLayerAttribution: string;
  children: React.ReactNode;
}

function LeafletMap({
  center,
  zoom,
  scrollWheelZoom,
  zoomControl,
  tileLayerUrl,
  tileLayerAttribution,
  children,
}: LeafletMapProps) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={scrollWheelZoom} zoomControl={zoomControl} className='w-screen m-8 rounded-lg'>
      <TileLayer
        attribution={tileLayerAttribution}
        url={tileLayerUrl}
      />
      {children}
    </MapContainer>
  );
}

export default LeafletMap;
