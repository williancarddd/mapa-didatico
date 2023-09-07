import { useCallback, useEffect } from "react";
import apiMapaDidaticoBackend from "../api/mapaDidaticoBackend";
import atomStations from '../atom/atomStations'
import { useAtom } from "jotai";
import { IStation } from "../interfaces/IStation";
import atomStationsFiltred from "../atom/atomStationsFiltred";

export default function useStation() {
    const [stations, setStations] = useAtom(atomStations);
    const [stationsFiltred, setStationsFiltreds] = useAtom(atomStationsFiltred);
    
    const getStations = useCallback(async () => {
        const response = await apiMapaDidaticoBackend.get("/estacao");
        const stationsAxios = response.data;
        setStations(stationsAxios);
    }, []);

    useEffect(() => {
        getStations()
    }, [getStations])

    return { stations, setStations, stationsFiltred, setStationsFiltreds };
}