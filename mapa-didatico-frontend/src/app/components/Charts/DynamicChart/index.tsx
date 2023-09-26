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
};

const DynamicChart: React.FC<DynamicChartProps> = ({ data }) => {
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (!data) return;

        // Ordena os dados por data antes de processá-los
        data.sort((a, b) => {
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
            ...data.map((item) => [
                new Date(item.ano, item.mes - 1, item.dia), // Data
                item.media_temp, // Média de Temperatura
            ])
        ];

        setChartData(processedData);
    }, [data]);

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

    return (
        <div>
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
