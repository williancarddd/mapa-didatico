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
                <div className="inline-flex items-center justify-center w-full">
                    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                    <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Dados do INMET</span>
                </div>
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
                    <HeatmapChart data={avgData} title={`Media de Temperatura Diária ${selectedYearDatabaseData}`} />
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
                <div className="inline-flex items-center justify-center w-full">
                    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                    <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Regressão Linear & Animações</span>
                </div>
               
                <section className="flex flex-col w-full justify-center  m-4 pb-4 items-center">
                    <button disabled type="button" className="text-white bg-blue-700 hover:bg-astronaut-800focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center justify-center w-[300px]">
                        <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                        </svg>
                        Loading...
                    </button>
                </section>
            </div>
        </>
    )
}