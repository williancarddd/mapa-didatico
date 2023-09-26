'use client'
import React, { useState } from "react";

import { estados, getRegion } from "@/app/utils/getStateAndRegion";
import { IEstate } from "@/app/interfaces/IRegionAndState";
import useStation from "@/app/hooks/useStations";
import ImageLogo from "../ImageLogo";

export default function ListStates() {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedRegionStates, setSelectedRegionStates] = useState<IEstate[]>([]);
  const { setStationsFiltreds, stations } = useStation();

  const handleRegionClick = (regiao: React.SetStateAction<string>) => {
    if (selectedRegion === regiao) {
      // Se a região clicada já estiver selecionada, feche a lista de estados
      setSelectedRegion('');
      setSelectedRegionStates([]);
    } else {
      // Caso contrário, exiba a lista de estados correspondente à região clicada
      setSelectedRegion(regiao);

      // Filtrar estados com base na região selecionada
      const estadosNaRegiao = estados.filter((estado) => estado.regiao === regiao);
      setSelectedRegionStates(estadosNaRegiao);
    }
  };

  return (
    <div className="flex flex-col w-2/12  bg-astronaut-900 rounded-xl m-4 g-4 ">
      <div className="flex flex-col items-center justify-center  w-full h-1/4 bg-astronaut-950 ">
        <ImageLogo />
      </div>
      <div className="h-[750px] overflow-y-auto scrollbar-thin scrollbar-thumb-astronaut-800 ">
        {getRegion(estados).map((regiaoAndState, index) => (
          <div key={index}>
            <div
              className="flex flex-col justify-center items-center m-4 cursor-pointer"
              onClick={() => handleRegionClick(regiaoAndState.regiao)}
            >
              <p className="text-bold h-16  w-5/6 p-4 text-center bg-astronaut-700 text-white text-2xl rounded-xl justify-center items-center">
                {regiaoAndState.regiao}
              </p>
            </div>
            {selectedRegion === regiaoAndState.regiao && (
              <div className="m-4">
                <ul className="text-white">
                  {selectedRegionStates.map((estado, index) => (
                    <li key={index} className="p-2 text-center rounded-lg cursor-pointer hover:bg-astronaut-300 transition-background-color duration-300" onClick={
                        () => {
                            setStationsFiltreds(
                                stations.filter(e => e.regiao == estado.regiao && e.uf == estado.uf  )
                              )
                        }
                    }>{estado.uf}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
