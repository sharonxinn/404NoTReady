import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const Dashboard = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Greeting Section */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Hello, Sharon!</Text>
        <Text style={styles.greetingSubText}>Welcome back to your dashboard.</Text>
      </View>

      {/* Sales Summary Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Sales Summary</Title>
          <Paragraph>Total Sales: $12,345</Paragraph>
          <Paragraph>New Sales Today: $345</Paragraph>
        </Card.Content>
      </Card>

      {/* Orders Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Orders Summary</Title>
          <Paragraph>Total Orders: 234</Paragraph>
          <Paragraph>New Orders Today: 12</Paragraph>
        </Card.Content>
      </Card>

      {/* Newsletter Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Latest Newsletters</Title>
          <Paragraph>Check out our latest updates and offers!</Paragraph>
          <Button mode="contained" style={styles.button}>Read Newsletter</Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  greetingContainer: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  greetingSubText: {
    fontSize: 16,
    color: '#777',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 12,
  },
});

export default Dashboard;
