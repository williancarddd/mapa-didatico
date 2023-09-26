import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

// Defina os tipos para os objetos de dados
type WeatherDataItem = {
    dia: number;
    mes: number;
    ano: number;
    temp_minima: number;
    temp_maxima: number;
};

type AvgDataItem = {
    dia: number;
    mes: number;
    ano: number;
    media_temp: number;
};

type IntervalLinesProps = {
    weatherData: WeatherDataItem[];
    avgData: AvgDataItem[];
};

export function IntervalLines({ weatherData, avgData }: IntervalLinesProps) {
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (!weatherData || !avgData) return;

        // Ordene os dados por data antes de processá-los
        weatherData.sort((a, b) => {
            const dateA: Date = new Date(a.ano, a.mes - 1, a.dia);
            const dateB: Date = new Date(b.ano, b.mes - 1, b.dia);
            return dateA.getTime() - dateB.getTime();
        });

        // Crie os dados do gráfico com a série de intervalos
        const processedData = [
            [
                { type: "date", label: "Data" },
                { type: "number", label: "Temperatura Mínima" },
                { type: "number", label: "Temperatura Máxima" },
                { type: "number", label: "Média de Temperatura" },
            ],
            ...weatherData.map((item, index) => [
                new Date(item.ano, item.mes - 1, item.dia),
                item.temp_minima,
                item.temp_maxima,
                avgData[index] ? avgData[index].media_temp : null,
            ]),
        ];

        setChartData(processedData);
    }, [weatherData, avgData]);

    const options = {
        title: "Temperaturas Mínima, Máxima e Média",
        curveType: "function",
        series: {
            0: { color: "#1be7dd", label: "Temperatura Mínima" },
            1: { color: "#b63322", label: "Temperatura Máxima" },
            2: { color: "#6F9654", label: "Média de Temperatura" },
        },
        legend: { position: "bottom" },
        intervals: { style: 'area' },
        hAxis: {
            format: "MMM",
        },
        pointSize: 2, // Define o tamanho dos pontos
        dataLabels: 'value' // Exibe os rótulos dos pontos
    };

    return (
        <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={chartData}
            options={options}
        />
    );
}
