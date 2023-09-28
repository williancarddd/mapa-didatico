import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

type DataItem = {
    dia: number;
    mes: number;
    ano: number;
    media_temp: number;
};

type DynamicChartProps = {
    data: DataItem[];
    disableFilter?: boolean; // Adicionando a prop disableFilter
};

const DynamicChart: React.FC<DynamicChartProps> = ({ data, disableFilter = false }) => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

    useEffect(() => {
        if (!data) return;

        // Filtrar os dados com base no mês selecionado (se o filtro não estiver desativado)
        let filteredData = data;
        if (selectedMonth !== null && !disableFilter) {
            filteredData = data.filter(item => item.mes === selectedMonth);
        }

        // Ordena os dados por data antes de processá-los
        filteredData.sort((a, b) => {
            const dateA: Date = new Date(a.ano, a.mes - 1, a.dia);
            const dateB: Date = new Date(b.ano, b.mes - 1, b.dia);
            return dateA.getTime() - dateB.getTime();
        });

        // Processa os dados no formato esperado pelo gráfico
        const processedData = [
            [
                { type: "date", label: "Data" }, // Tipo de data
                { type: "number", label: "Média de Temperatura" },
            ],
            ...filteredData.map((item) => [
                new Date(item.ano, item.mes - 1, item.dia), // Data
                item.media_temp, // Média de Temperatura
            ])
        ];

        setChartData(processedData);
    }, [data, selectedMonth, disableFilter]);

    const options = {
        title: "Média de Temperatura Por Dia",
        curveType: "function",
        series: {
            0: { color: "#6F9654", label: "Temperatura Média" },
        },
        legend: { position: "bottom" },
        hAxis: {
            format: "dd/MM/yyyy", // Formato de data desejado
        },
        pointSize: 2, // Define o tamanho dos pontos
        dataLabels: 'value' // Exibe os rótulos dos pontos
    };

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = parseInt(event.target.value);
        setSelectedMonth(selected);
    };

    return (
        <div>
            {/* Filtro de Mês (apenas se o filtro não estiver desativado) */}
            {!disableFilter && (
                <select onChange={handleMonthChange}>
                    <option>Mostrar todos os meses</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                        <option key={month} value={month}>
                            Mês {month}
                        </option>
                    ))}
                </select>
            )}

            {/* Gráfico */}
            <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={chartData}
                options={options}
            />
        </div>
    );
};

export default DynamicChart;
