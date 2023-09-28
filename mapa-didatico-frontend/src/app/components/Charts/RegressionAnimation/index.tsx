'use client'

import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  MarkSeries,
  MarkSeriesPoint,
} from 'react-vis';

interface DataPoint {
  dia: number;
  mes: number;
  ano: number;
  media_temp: number;
}

interface RegressionChartProps {
  data: DataPoint[];
  coefficients: number[];
}

const RegressionChart: React.FC<RegressionChartProps> = ({ data, coefficients }) => {
  const handleDataPointClick = (datapoint: MarkSeriesPoint) => {
    // Aqui você pode adicionar lógica para lidar com o clique em um ponto de dados
    console.log('Ponto de dados clicado:', datapoint);
  };

  // Converter seus dados para o formato correto
  const formattedData = data.map((datapoint) => ({
    x: datapoint.dia,
    y: datapoint.media_temp,
  }));

  return (
    <div>
      <XYPlot width={400} height={300} margin={{ left: 50, right: 20, top: 10, bottom: 40 }}>
      
        <XAxis title="Dia" />
        <YAxis title="Média de Temperatura" />
        <MarkSeries
          data={formattedData}
          onValueClick={(datapoint) => handleDataPointClick(datapoint)}
          opacity={0.7}
        />
      </XYPlot>
      <div>
        <p>Coeficientes: {coefficients.join(', ')}</p>
      </div>
    </div>
  );
};

export default RegressionChart;
