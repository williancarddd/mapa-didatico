import { Icon } from 'leaflet'
import markerIconPng from "../../../assets/favicon-32x32.png"
export function IconMap() {
    return new Icon({
        iconUrl: markerIconPng.src,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    })

}