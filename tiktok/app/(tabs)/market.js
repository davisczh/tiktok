import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SearchBar from '../../components/SearchBar';
import { ThemedView } from '../../components/ThemedView';


export default function Market() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.0.123:3000/api/products');
      const jsonData = await response.json();
      console.log('Data fetched');
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SearchBar data={data} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
  },
  items: {
    flexDirection: 'row',
    flexWrap: '1',
    justifyContent: 'center',
  },
});