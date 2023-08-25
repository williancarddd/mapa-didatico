'use client'
import { MapContainer, Marker, Popup, TileLayer  } from 'react-leaflet'
import osm from "./osm-provider"
import 'leaflet/dist/leaflet.css';
import markerIconPng from "../../../assets/favicon-32x32.png"
import {Icon} from 'leaflet'
export default function LeafletMap() {
    const ZOOM_LEVEL = 3.5
    return (
        <MapContainer  center={[-15.671267, -48.047546]} zoom={ZOOM_LEVEL} scrollWheelZoom={true} zoomControl={true}  className='w-screen  m-8 rounded-lg' >
            <TileLayer
                attribution={osm.maptiler.attribution}
                url={osm.maptiler.url}
            />
            <Marker position={[-15.671267, -48.047546]} icon={new Icon({
                iconUrl: markerIconPng.src,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32],
            })} >
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    )
}