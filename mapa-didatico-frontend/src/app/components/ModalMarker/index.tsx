'use client'

import useStationSelected from "@/app/hooks/useStationSelected"
import StationInfo from "../StationInfo";
import apiMapaDidaticoBackend from "@/app/api/mapaDidaticoBackend";
import { SetStateAction, useEffect, useState } from "react";
import { IntervalLines } from "../Charts/IntervalLines";
import DynamicChart from "../Charts/DynamicChart";

export default function ModalMarker() {
    const { stationSelected } = useStationSelected();
    const [xyzs, setXyz] = useState([]);
    const [avgData, setAvgData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth() + 1);
    const [dataFromQuery, setDataFromQuery] = useState([]);

    async function handleGetData() {
        const xyz = await apiMapaDidaticoBackend.get('/metrics/filter-x-y-z/' + stationSelected?.id)
        console.log(xyz)
        setXyz(xyz.data);

        const avgs = await apiMapaDidaticoBackend.get('/metricas/filter-average-year/' + stationSelected?.id)
        console.log(avgs)
        setAvgData(avgs.data);
    }


    const handleMonthChange = async (value: string) => {
        const selectedMonth = parseInt(value, 10);
        setSelectedMonth(selectedMonth);

        await
            apiMapaDidaticoBackend
                .get(`/metricas/filter-average-month/305/${selectedMonth}`)
                .then((response: { data: SetStateAction<never[]>; }) => {
                    setDataFromQuery(response.data);
                })
                .catch((error: any) => {
                    console.error("Erro ao buscar os dados:", error);
                });
    };

    useEffect(() => {
        handleGetData()
        handleMonthChange(String(selectedMonth));
    }, [])


    console.log(dataFromQuery)
    return (
        <>
            <div className="h-screen p-8 mb-4">
                <StationInfo station={stationSelected} />
                <IntervalLines weatherData={xyzs} avgData={avgData} />
                <DynamicChart data={dataFromQuery} />

                <section className="flex w-full justify-center m-4 pb-4">
                    <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mês</label>
                    <select id="monthFilter" onChange={(e) => handleMonthChange(e.target.value)}
                        value={selectedMonth || ""} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5  ">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </section>

                <div className="inline-flex items-center justify-center w-full">
                    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                        <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Previsões</span>
                </div>
            </div>
        </>
    )
}