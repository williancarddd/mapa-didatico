import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface APIAverageData {
  dia: number;
  mes: number;
  ano: number;
  media_temp: number;
}

interface HeatmapChartProps {
  data: APIAverageData[];
  title: string;
  functionWhenClickMoth?: (month: number) => {}
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ data, title, functionWhenClickMoth }) => {
  // Organize os dados em um formato adequado para o gráfico de calor
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const maxDaysInMonth = Math.max(
    ...monthNames.map((month, index) =>
      data.filter(item => item.mes === index + 1).length
    )
  );

  const daysArray = Array.from({ length: maxDaysInMonth }, (_, index) => index + 1);

  const heatmapData = monthNames.map((month, index) => {
    const monthData = data.filter(item => item.mes === index + 1);
    const seriesData = daysArray.map(day => {
      const dayData = monthData.find(item => item.dia === day);
      return dayData ? dayData.media_temp : null;
    });

    return {
      name: month,
      data: seriesData,
    };
  });
 
  return (
    <div>
      <ReactApexChart
        options={{
          chart: {
            type: 'heatmap',
            events: {
              click(event, chartContext, { dataPointIndex, seriesIndex }) {
                const clickedMonth = seriesIndex +1;
                if(functionWhenClickMoth) functionWhenClickMoth(clickedMonth);
              }
            },
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            heatmap: {
              shadeIntensity: 0.5, // Reduza a intensidade da sombra
              radius: 0, // Remova o raio
              useFillColorAsStroke: true,
              enableShades: true,
              distributed: true,
              reverseNegativeShade: true,
            },
          },
          xaxis: {
            type: 'category',
            categories: daysArray,
            title: {
              text: 'Dia',
            },
          },
          yaxis: {
            title: {
              text: 'Mês',
            },
          },
          dataLabels: {
            enabled: false,
          },
          colors: ['#00A100', '#2EB82E', '#128FD9', '#FFB200', '#FF0000'],
          title: {
            text: title,
          },
        }}
        series={heatmapData}
        type="heatmap"
        height={350}
      />
    </div>
  );
};

export default HeatmapChart;
