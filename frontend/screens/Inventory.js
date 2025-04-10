import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';

const InventoryPage = () => {
  // Static data for stock and sales
  const products = [
    { id: 1, name: 'Product A', stock: 8 },
    { id: 2, name: 'Product B', stock: 15 },
    { id: 3, name: 'Product C', stock: 5 },
  ];

  const salesData = [
    { month: 'Jan', sales: 500 },
    { month: 'Feb', sales: 700 },
    { month: 'Mar', sales: 450 },
    { month: 'Apr', sales: 800 },
  ];

  // Preparing stock data for the graph
  const stockData = {
    labels: products.map((item) => item.name),
    datasets: [
      {
        data: products.map((item) => item.stock),
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Red for stock levels
        strokeWidth: 2,
      },
    ],
  };

  // Preparing sales data for the graph
  const salesDataGraph = {
    labels: salesData.map((item) => item.month),
    datasets: [
      {
        data: salesData.map((item) => item.sales),
        color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // Blue for sales
        strokeWidth: 2,
      },
    ],
  };

  // Alert for low stock items
  products.forEach((item) => {
    if (item.stock < 10) {
      Alert.alert(`Low stock alert: ${item.name} has only ${item.stock} left!`);
    }
  });

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.pageTitle}>Inventory & Sales</Title>

      {/* Display product inventory */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Inventory Status</Title>
          {products.length > 0 ? (
            products.map((item) => (
              <View key={item.id}>
                <Text>{item.name}: {item.stock} in stock</Text>
                {item.stock < 10 && <Text style={styles.lowStockText}>Low stock!</Text>}
              </View>
            ))
          ) : (
            <Text>No products found.</Text>
          )}
        </Card.Content>
      </Card>

      {/* Stock Status Graph */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Stock Status</Title>
          <BarChart
            data={stockData}
            width={350}
            height={220}
            chartConfig={chartConfig}
            fromZero={true}
          />
        </Card.Content>
      </Card>

      {/* Sales Status Graph */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Sales Status</Title>
          <LineChart
            data={salesDataGraph}
            width={350}
            height={220}
            chartConfig={chartConfig}
            bezier
          />
        </Card.Content>
      </Card>

      {/* Waste Reduction Tips */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Waste Reduction Tips</Title>
          <Paragraph>Item A: Slow-moving stock. Suggested discount: 20%.</Paragraph>
          <Paragraph>Item B: Slow-moving stock. Suggested discount: 15%.</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#f5f5f5',
  backgroundGradientTo: '#f5f5f5',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
  },
  lowStockText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default InventoryPage;
