import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';

const Insights = () => {
  // Static Sales Data
  const salesData = {
    daily: [120, 150, 200, 170, 180, 220, 250], // Sales per day
    weekly: [900, 1100, 1300, 1250], // Sales per week
    monthly: [4000, 4500, 4800, 5000], // Sales per month
  };

  const screenWidth = Dimensions.get("window").width - 40;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Real-time Sales Tracking */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Real-Time Sales Tracking</Title>
          <Text style={styles.chartLabel}>Daily Sales</Text>
          <LineChart
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [{ data: salesData.daily }]
            }}
            width={screenWidth}
            height={220}
            yAxisLabel="$"
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Predictive Insights */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Predictive Insights</Title>
          <Paragraph>🔮 AI predicts a **10% increase** in demand next week. Consider restocking essential items.</Paragraph>
          <Paragraph>🛒 Recommended Replenishment: <Text style={styles.highlight}>Milk, Eggs, Fresh Vegetables</Text></Paragraph>
        </Card.Content>
      </Card>

      {/* Competitor Benchmarking */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Competitor Benchmarking</Title>
          <Text style={styles.chartLabel}>Your Sales vs. Industry</Text>
          <BarChart
            data={{
              labels: ["You", "Avg Market"],
              datasets: [{ data: [4800, 5200] }] // Your sales vs Competitor
            }}
            width={screenWidth}
            height={220}
            yAxisLabel="$"
            chartConfig={chartConfig}
            style={styles.chart}
          />
          <Paragraph>📊 Your sales are **8% lower** than the market average. Consider promotions or marketing strategies.</Paragraph>
        </Card.Content>
      </Card>

    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(26, 188, 156, ${opacity})`, // Green theme
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 10,
    marginVertical: 10,
  },
  chartLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  highlight: {
    fontWeight: "bold",
    color: "#E74C3C",
  },
});

export default Insights;
