import { useCallback, useEffect } from "react";
import apiMapaDidaticoBackend from "../api/mapaDidaticoBackend";
import { IRegiaoAndState } from "../interfaces/IRegiaoAndState";

const TOKEN_STATIONS = "token_stations";
const TOKEN_REGIOES_AND_UF = 'token_regioes_and_uf'
export default function useStation() {
    const getStations = useCallback(async () => {
        if (localStorage.getItem(TOKEN_STATIONS)) return;
        const response = await apiMapaDidaticoBackend.get("/estacao");
        const stations = response.data;
        localStorage.setItem(TOKEN_STATIONS, JSON.stringify(stations));
        const regioes_and_uf = stations.map((station: any) => {
            return { regiao: station.regiao, uf: station.uf }
        }).filter((station: any, index: number, self: any) => {
            return index === self.findIndex((t: any) => (
                t.regiao === station.regiao && t.uf === station.uf
            ))
        }
        )
        localStorage.setItem(TOKEN_REGIOES_AND_UF, JSON.stringify(regioes_and_uf));

    }, []);

    const getStatiosStorage = () => {
        const stations = localStorage.getItem(TOKEN_STATIONS);
        if (!stations) return [];
        return JSON.parse(stations);
    }

    const getRegioesAndUfStorage = () => {
        const regioes_and_uf = localStorage.getItem(TOKEN_REGIOES_AND_UF);
        if (!regioes_and_uf) return [];
        return JSON.parse(regioes_and_uf) as IRegiaoAndState[];
    }
    return { getStations, getStatiosStorage, getRegioesAndUfStorage };
}