'use client'
import { MapContainer,  TileLayer  } from 'react-leaflet'
import osm from "./osm-provider"
import 'leaflet/dist/leaflet.css';
import useStation from '@/app/hooks/useStations';
import Markers from '../Markers';
import ModalCust from '../Modal';
import { useModal } from '@/app/hooks/useModal';
import ModalMarker from '../ModalMarker';




export default function LeafletMap() {
    const {stationsFiltred } = useStation();
    const {modal, setModal} = useModal();
    const ZOOM_LEVEL = 3.5
    return (
        <MapContainer  center={[-15.671267, -48.047546]} zoom={ZOOM_LEVEL} scrollWheelZoom={true} zoomControl={true}  className='w-screen  m-8 rounded-lg  ' >
            <TileLayer
                attribution={osm.maptiler.attribution}
                url={osm.maptiler.url}
            />
            <Markers  data={stationsFiltred} />
            <ModalCust open={modal} setOpen={setModal} title="Prática de Interpolação Polinomial e Regressão Linear" content={[
                <ModalMarker key={'modalMarker'} />
            ]}/>
        </MapContainer>
    )
}