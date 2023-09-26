'use client'
import useStationSelected from "@/app/hooks/useStationSelected"
import StationInfo from "../StationInfo";
import apiMapaDidaticoBackend from "@/app/api/mapaDidaticoBackend";
import { SetStateAction, useEffect, useState } from "react";
import { IntervalLines } from "../Charts/IntervalLines";
import DynamicChart from "../Charts/DynamicChart";
import HeatmapChart from "../Charts/HeatMap";
import SelectComponent from "../SelectComponent";

export default function ModalMarker() {
    const { stationSelected } = useStationSelected();
    const [xyzs, setXyz] = useState([]);
    const [avgData, setAvgData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<string | undefined>(String(new Date().getFullYear()));
    const [selectedYearDatabaseData, setSelectedYearDatabaseData] = useState<string | undefined>('2021');
    const [dataFromQuery, setDataFromQuery] = useState([]);
    const [dataFromQueryLinear, setDataFromQueryLinear] = useState([]);
    const [formulaLinear, setFormulaLinear] = useState('');

    async function handleGetData() {
        const xyz = await apiMapaDidaticoBackend.get(`/metrics/filter-x-y-z/${stationSelected?.id}/${selectedYearDatabaseData}`)
        const avgs = await apiMapaDidaticoBackend.get(`/metricas/filter-average-year/${stationSelected?.id}/${selectedYearDatabaseData}`)
        setAvgData(avgs.data);
        setXyz(xyz.data);
    }


    const handleMonthChange = async (value: string) => {
        const selectedMonth = parseInt(value, 10);
        setSelectedMonth(selectedMonth);

        await
            apiMapaDidaticoBackend
                .get(`/metricas/filter-average-month/${stationSelected?.id}/${selectedYearDatabaseData}/${selectedMonth}`)
                .then((response: { data: SetStateAction<never[]>; }) => {
                    setDataFromQuery(response.data);

                })
                .catch((error: any) => {
                    console.error("Erro ao buscar os dados:", error);
                });
    };

    const handleYearChange = async (value: string | undefined) => {
        if (value?.trim() == undefined) return;
        const selectedYear = parseInt(value);
        setSelectedYear(value);

        await
            apiMapaDidaticoBackend
                .get(`/linear/${stationSelected?.id}/${selectedYear}`)
                .then((response: { data: any; }) => {
                    console.log(response)
                    setDataFromQueryLinear(response.data.mapeado);
                    setFormulaLinear(response.data.formula)
                })
                .catch((error: any) => {
                    console.error("Erro ao buscar os dados:", error);
                });
    };

    useEffect(() => {
        handleGetData()
        handleMonthChange(String(selectedMonth));
        handleYearChange(String(selectedYear));
    }, [selectedYearDatabaseData])

    return (
        <>
            <div className="h-screen p-8 mb-4">
                <StationInfo station={stationSelected} />
                <section className="inline-flex items-center justify-center w-full">
                    <SelectComponent
                        id="selectedYearDatabaseData"
                        label="Ano dos Dados"
                        options={['2021', '2022']}
                        value={selectedYearDatabaseData}
                        onChange={setSelectedYearDatabaseData}
                    />
                </section>
                <IntervalLines weatherData={xyzs} avgData={avgData} />
                <DynamicChart data={dataFromQuery} />

                <section className="flex w-full justify-center m-4 pb-4">
                    <SelectComponent
                        id="yearFilter"
                        label="Mês"
                        options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(e => String(e))}
                        value={selectedYear}
                        onChange={handleYearChange}
                    />
                </section>
                <div className="inline-flex items-center justify-center w-full">
                    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                    <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Previsões Regressão Linear</span>
                </div>
                <section className="flex flex-col w-full justify-center m-4 pb-4">
                    <HeatmapChart data={avgData} title='Media de Temperatura Diária 2022' />
                    <section className="flex flex-col w-full justify-center m-4 pb-4">
                        <HeatmapChart data={dataFromQueryLinear} title={`Media de Temperatura Diária Prevista Com Regressão Linear: (${selectedYear})`} />
                        <SelectComponent
                            id="yearFilter"
                            label="Ano"
                            options={['2023', '2024', '2025', '2026', '2027']}
                            value={selectedYear}
                            onChange={handleYearChange}
                        />

                        {formulaLinear}
                    </section>
                </section>

            </div>
        </>
    )
}