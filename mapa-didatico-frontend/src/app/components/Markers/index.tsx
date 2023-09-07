'use client'
import { Marker, Popup, useMap } from "react-leaflet";
import { IconMap } from "../IconMap";
import { IStation } from "@/app/interfaces/IStation";
import { useCallback } from "react";
import { useModal } from "@/app/hooks/useModal";
import useStationSelected from "@/app/hooks/useStationSelected";

interface PropsMarkers {
    data: IStation[]
}
export default function Markers({  data }: PropsMarkers) {
    const map = useMap();
    const {setModal} = useModal();
    const {setStationSelected} = useStationSelected();
    const handleClickMarker = useCallback((marker: IStation) => {
      map.setView(
        [
         parseFloat(marker.latitude),
         parseFloat(marker.longitude)
        ]
      );
      setModal(true);
      setStationSelected(marker);
    }, [])
    return (
      data.length > 0 &&
      data?.map((marker, index) => {
        // check NaN
        if (isNaN(parseFloat(marker.latitude)) || isNaN(parseFloat(marker.longitude))) {
          return null;
        }
        return (
          <Marker 
            eventHandlers={{
              click: () => {
                handleClickMarker(marker)
              }
            }}

            key={index}
            position={{
              lat:parseFloat(marker.latitude), // your api structure
              lng: parseFloat(marker.longitude) // your api structure
            }}
            icon={IconMap()}
          >
            <Popup>
              <span>{marker.uf + ' ' +marker.regiao }</span>
            </Popup>
          </Marker>
        );
      })
    );
  }