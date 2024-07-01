import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, Switch, Button } from 'react-native';
import { ProductItem } from './ProductItem';  
import Collapsible from '../components/Collapsible';
import { ThemedView } from './ThemedView';
import { useAuth } from '../app/utils/AuthContext';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [useLLM, setUseLLM] = useState(false);

  const [filterData, setFilterData] = useState({
    minPrice: '',
    maxPrice: '',
    selectedCategory: '',
    selectedSortOption: '',
  });

  
  const handleInputChange = (text) => {
    setQuery(text);
    console.log('Query:', text);  
  };

  const fetchFilteredData = async () => {
    try {
      console.log('Fetching filtered data...');
      console.log('Query:', query);
      console.log('filters:', filterData);
      const response = await fetch('http://192.168.0.123:3000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          ...filterData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  const fetchFilteredDataFromLLM = async () => {
    try {
      console.log('Fetching filtered data...');
      console.log('Query:', query);
      console.log('filters:', filterData);
      const response = await fetch('http://192.168.0.123:3000/api/search/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          ...filterData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  const handleSearch = () => {
    fetchFilteredData();
  };

  const handleLLMQuery = () => {
    fetchFilteredDataFromLLM();
  };

  const toggleLLM = () => {
    setUseLLM(!useLLM);
    setQuery('');
  };
  const postUserActivity = async (activity) => {
    try {
      const response = await fetch('http://192.168.0.123:3000/api/user/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activity),
      });
  
      const responseText = await response.text(); // Read the response as text
      console.log('Response text:', responseText);
  
      if (!response.ok) {
        throw new Error(responseText); // Throw an error if response is not ok
      }
  
      const responseData = JSON.parse(responseText); // Parse the response text as JSON
      console.log('User activity posted:', responseData);
    } catch (error) {
      console.error('Error posting user activity:', error);
    }
  };
  const handlePressItem = (item) => {
    console.log('Pressed item:', item.id);
    const activity = { action: 'product_click', productId: item.id, timestamp: new Date() };
    postUserActivity(activity);
  };

  useEffect(() => {
    fetchFilteredData();
  }, [filterData]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleInputChange}
          placeholder={useLLM ? "Query LLM..." : "Search..."}
        />
        <Button
          title="Search"
          onPress={useLLM ? handleLLMQuery : handleSearch}
        />
        <Switch
          value={useLLM}
          onValueChange={toggleLLM}
        />
      </View>
      <Collapsible filterData={filterData} onFilterChange={setFilterData} />
      <View>
        <FlatList
          data={filteredData}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductItem item={item} onPress={() => handlePressItem(item)} />
          )}
        />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginRight: 10,
  },
  item: {
    flex: 1,
    marginTop: 10,
    margin: 6,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default SearchBar;
