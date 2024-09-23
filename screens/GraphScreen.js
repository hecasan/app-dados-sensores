import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Certifique-se de importar o 'chart.js/auto' para registrar todos os componentes do gráfico.

export default function GraphScreen({ route }) {
  const [sensorData, setSensorData] = useState([]);
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
        setSensorData(data);
      } catch (error) {
        console.error('Erro ao buscar dados dos sensores:', error);
      }
    };

    fetchSensorData();
  }, [token]);

  const data = {
    labels: sensorData.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Temperatura',
        data: sensorData.map(item => item.temperatura),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        tension: 0.1, // Suavizar a linha do gráfico
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

  return (
    <View style={styles.container}>
      <Text>Gráfico de Dados dos Sensores</Text>
      <Line data={data} options={options} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
