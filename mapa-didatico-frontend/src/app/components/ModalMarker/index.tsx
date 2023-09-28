'use client'
import useStationSelected from "@/app/hooks/useStationSelected"
import StationInfo from "../StationInfo";
import apiMapaDidaticoBackend from "@/app/api/mapaDidaticoBackend";
import { SetStateAction, useEffect, useState } from "react";
import { IntervalLines } from "../Charts/IntervalLines";
import DynamicChart from "../Charts/DynamicChart";
import HeatmapChart from "../Charts/HeatMap";
import SelectComponent from "../SelectComponent";
import RegressionChart from "../Charts/RegressionAnimation";

export default function ModalMarker() {
    const { stationSelected } = useStationSelected();
    const [xyzs, setXyz] = useState([]);
    const [avgData, setAvgData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<string | undefined>(String(new Date().getFullYear()));
    const [selectedYearDatabaseData, setSelectedYearDatabaseData] = useState<string | undefined>('2021');
    const [dataFromQuery, setDataFromQuery] = useState([]);
    const [dataFromQueryLinear, setDataFromQueryLinear] = useState([]);
    const [formulaLinear, setFormulaLinear] = useState([]);

    async function handleGetData() {
        const xyz = await apiMapaDidaticoBackend.get(`/metrics/filter-x-y-z/${stationSelected?.id}/${selectedYearDatabaseData}`)
        const avgs = await apiMapaDidaticoBackend.get(`/metricas/filter-average-year/${stationSelected?.id}/${selectedYearDatabaseData}`)
        setAvgData(avgs.data);
        setXyz(xyz.data);
    }


    const handleMonthChange = (value: string | undefined) => {
        if (value === undefined) return;
        const selectedMonth = parseInt(value, 10);
        setSelectedMonth(selectedMonth);
        const filteredData = avgData.filter(item => item.mes === selectedMonth);
        setDataFromQuery(filteredData);
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

    function range(start: number, end: number) {
        return Array.from({ length: end - start + 1 }, (_, i) => i + start)
    }

    useEffect(() => {
        handleGetData()
        handleYearChange(String(selectedYear));
    }, [selectedYearDatabaseData])

    useEffect(() => {
        handleMonthChange(String(selectedMonth));
    } , [avgData]);
    
    return (
        <>
            <div className="h-screen p-8 mb-4">
                <StationInfo station={stationSelected} />
                <section className="inline-flex items-center justify-center w-full">
                    <SelectComponent
                        id="selectedYearDatabaseData"
                        label="Ano dos Dados"
                        options={range(2000, 2023).map(e => String(e))}
                        value={selectedYearDatabaseData}
                        onChange={setSelectedYearDatabaseData}
                    />
                </section>
                <IntervalLines weatherData={xyzs} avgData={avgData} />
                <DynamicChart data={dataFromQuery} disableFilter={true} />

                <section className="flex w-full justify-center m-4 pb-4">
                    <SelectComponent
                        id="monthFilter"
                        label="Mês"
                        options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']}
                        value={String(selectedMonth)}
                        onChange={handleMonthChange}
                    />
                </section>
                <section className="flex flex-col w-full justify-center m-4 pb-4">
                    <HeatmapChart data={avgData} title='Media de Temperatura Diária 2022' />
                </section>
                <div className="inline-flex items-center justify-center w-full">
                    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                    <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Previsões Regressão Linear</span>
                </div>
                <section className="flex flex-col w-full justify-center m-4 pb-4">
                    <section className="flex flex-col w-full justify-center  m-4 pb-4">
                        <HeatmapChart data={dataFromQueryLinear} title={`Media de Temperatura Diária Prevista Com Regressão Linear: (${selectedYear})`} />
                        
                        <DynamicChart data={dataFromQueryLinear} />
                        <section className="flex w-full justify-center m-4 pb-4">

                            <SelectComponent
                                id="yearFilter"
                                label="Ano"
                                options={['2023', '2024', '2025', '2026', '2027', '2028']}
                                value={selectedYear}
                                onChange={handleYearChange}
                            />
                        </section>
                    </section>
                </section>
            </div>
        </>
    )
}