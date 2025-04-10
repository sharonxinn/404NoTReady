import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const StorePage = () => {
  // Static data
  const storeData = {
    brandName: 'My Awesome Store',
    buildingName: 'Sky Tower',
    location: '123 Street, City, Country',
    pickupInstructions: 'Please call before pickup.',
    storeManager: 'John Doe',
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Store Information</Title>
          <Paragraph style={styles.text}><Text style={styles.label}>Brand Name:</Text> {storeData.brandName}</Paragraph>
          <Paragraph style={styles.text}><Text style={styles.label}>Building Name:</Text> {storeData.buildingName}</Paragraph>
          <Paragraph style={styles.text}><Text style={styles.label}>Location:</Text> {storeData.location}</Paragraph>
          <Paragraph style={styles.text}><Text style={styles.label}>Pickup Instructions:</Text> {storeData.pickupInstructions}</Paragraph>
          <Paragraph style={styles.text}><Text style={styles.label}>Store Manager:</Text> {storeData.storeManager}</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F4F6F9',
  },
  card: {
    borderRadius: 10,
    paddingVertical: 10,
    elevation: 4, // Shadow effect
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#2E2E2E',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#4A4A4A',
  },
  label: {
    fontWeight: 'bold',
    color: '#1E88E5',
  },
});

export default StorePage;
