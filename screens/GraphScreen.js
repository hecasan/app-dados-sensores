import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Picker } from 'react-native';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function GraphScreen({ route }) {
  const [sensorData, setSensorData] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('lastHour'); // Novo estado para intervalo de tempo
  const { token } = route.params;

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch('http://localhost:3000/dados-sensores', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        const filteredData = filterSensorData(data); // Aplicar filtro
        setSensorData(filteredData);
      } catch (error) {
        console.error('Erro ao buscar dados dos sensores:', error);
      }
    };

    fetchSensorData();
  }, [token, timeRange]); // Dependência adicionada

  const filterSensorData = (data) => {
    const now = new Date();
    return data.filter(item => {
      const itemDate = new Date(item.timestamp);
      switch (timeRange) {
        case 'lastHour':
          return itemDate >= new Date(now - 60 * 60 * 1000);
        case 'last24Hours':
          return itemDate >= new Date(now - 24 * 60 * 60 * 1000);
        case 'lastWeek':
          return itemDate >= new Date(now - 7 * 24 * 60 * 60 * 1000);
        case 'last30Days':
          return itemDate >= new Date(now - 30 * 24 * 60 * 60 * 1000); // Últimos 30 dias
        default:
          return true; // Caso padrão (sem filtro)
      }
    });
  };

  const data = {
    labels: sensorData.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Temperatura',
        data: sensorData.map(item => item.temperatura),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tempo',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Temperatura (°C)',
        },
        beginAtZero: true,
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={data} options={options} />;
      case 'bar':
        return <Bar data={data} options={options} />;
      default:
        return <Line data={data} options={options} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gráfico de Dados dos Sensores</Text>
      <Picker
        selectedValue={timeRange}
        style={styles.picker}
        onValueChange={(itemValue) => setTimeRange(itemValue)}
        itemStyle={styles.pickerItem}
      >
        <Picker.Item label="Última Hora" value="lastHour" />
        <Picker.Item label="Últimas 24 Horas" value="last24Hours" />
        <Picker.Item label="Última Semana" value="lastWeek" />
        <Picker.Item label="Últimos 30 Dias" value="last30Days" /> {/* Nova opção */}
      </Picker>
      <Picker
        selectedValue={chartType}
        style={styles.picker}
        onValueChange={(itemValue) => setChartType(itemValue)}
        itemStyle={styles.pickerItem}
      >
        <Picker.Item label="Linha" value="line" />
        <Picker.Item label="Barra" value="bar" />
      </Picker>
      {renderChart()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  picker: { height: 40, width: 150, marginBottom: 20, borderColor: '#ccc', borderWidth: 1, borderRadius: 5 },
  pickerItem: { height: 40 },
});
