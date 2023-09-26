'use client';
import React from 'react';
import Markers from '../Markers';
import LeafletMap from '../LeafletMap';
import { configLeafLet } from '../LeafletMap/osm-provider';
import useStation from '@/app/hooks/useStations';
import { useModal } from '@/app/hooks/useModal';
import ModalCust from '../Modal';
import ModalMarker from '../ModalMarker';

function MainMap() {
    const { stationsFiltred } = useStation();
    const { modal, setModal } = useModal();
    return (
        <LeafletMap
            center={[-15.671267, -48.047546]}
            zoom={3.5}
            scrollWheelZoom={true}
            zoomControl={true}
            tileLayerUrl={configLeafLet.maptiler.url}
            tileLayerAttribution={configLeafLet.maptiler.attribution}
        >
            <Markers data={stationsFiltred} />
            <ModalCust open={modal} setOpen={setModal} title="Prática de Interpolação Polinomial e Regressão Linear" content={[
                <ModalMarker key={'modalMarker'} />
            ]} />
        </LeafletMap>
    );
}

export default MainMap;
