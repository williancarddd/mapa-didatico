'use client'
import { MapContainer,  TileLayer  } from 'react-leaflet'
import osm from "./osm-provider"
import 'leaflet/dist/leaflet.css';
import useStation from '@/app/hooks/useStations';
import { useEffect, useState } from 'react';
import Markers from '../Markers';
import { IStation } from '@/app/interfaces/IStation';



export default function LeafletMap() {
    const { getStations, getStatiosStorage } = useStation();
    const [markers, setMarkers] = useState<IStation[]>([])

    useEffect(() => {
        getStations()
        
    }, [getStations])

    useEffect(() => {
        setMarkers(getStatiosStorage())
    }, [markers, getStatiosStorage])
    
    const ZOOM_LEVEL = 3.5
    return (
        <MapContainer  center={[-15.671267, -48.047546]} zoom={ZOOM_LEVEL} scrollWheelZoom={true} zoomControl={true}  className='w-screen  m-8 rounded-lg' >
            <TileLayer
                attribution={osm.maptiler.attribution}
                url={osm.maptiler.url}
            />
            <Markers  data={markers} />
        </MapContainer>
    )
}