import { useCallback, useEffect } from "react";
import apiMapaDidaticoBackend from "../api/mapaDidaticoBackend";

const TOKEN_STATIONS = "token_stations";
export default function useStation(){
    const getStations  = useCallback(async () => {
        if (localStorage.getItem(TOKEN_STATIONS)) return;
        const response = await apiMapaDidaticoBackend.get("/estacao");
        const stations = response.data;
        localStorage.setItem(TOKEN_STATIONS, JSON.stringify(stations));
    
    }, []);

   const getStatiosStorage = () => {
        const stations = localStorage.getItem(TOKEN_STATIONS);
        if (!stations) return [];
        return JSON.parse(stations);
   }

    return {getStations, getStatiosStorage};
}