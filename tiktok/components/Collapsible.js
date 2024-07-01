// src/components/CollapsibleFilter.js
import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Collapsible from 'react-native-collapsible';

const CollapsibleFilter = ({ filterData, onFilterChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const updatePrice = (key, value) => {
    onFilterChange({
      ...filterData,
      [key]: value,
    });
    console.log('Price:', key, value);
  };

  const updateCategory = (category) => {
    onFilterChange({
      ...filterData,
      selectedCategory: category,
    });
    console.log('Category:', category);
  };

  const updateSortOption = (sortOption) => {
    onFilterChange({
      ...filterData,
      selectedSortOption: sortOption,
    });
    console.log('Sort:', sortOption);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
        <Text style={styles.header}>Filters</Text>
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.optionContainer}>
          <Text style={styles.optionLabel}>Filter by Price</Text>
          <View style={styles.priceInputsContainer}>
            <TextInput
              style={styles.priceInput}
              placeholder="Min Price"
              keyboardType="numeric"
              value={filterData.minPrice}
              onChangeText={(value) => updatePrice('minPrice', value)}
            />
            <TextInput
              style={styles.priceInput}
              placeholder="Max Price"
              keyboardType="numeric"
              value={filterData.maxPrice}
              onChangeText={(value) => updatePrice('maxPrice', value)}
            />
          </View>
        </View>

        <View style={styles.optionContainer}>
          <Text style={styles.optionLabel}>Category</Text>
          <Picker
            selectedValue={filterData.selectedCategory}
            style={styles.picker}
            onValueChange={(itemValue) => updateCategory(itemValue)}
          > 
            <Picker.Item label="None" value="none" />
            <Picker.Item label="Electronics" value="Electronics" />
            <Picker.Item label="Sports" value="Sports" />
            <Picker.Item label="Clothing" value="Clothing" />
            <Picker.Item label="Books" value="Books" />
            <Picker.Item label="Beauty Products" value="Beauty Products" />
            <Picker.Item label="Home Appliances" value="Home Appliances" />
          

          </Picker>
        </View>

        <View style={styles.optionContainer}>
          <Text style={styles.optionLabel}>Sort By</Text>
          <Picker
            selectedValue={filterData.selectedSortOption}
            style={styles.picker}
            onValueChange={(itemValue) => updateSortOption(itemValue)}
          >
            <Picker.Item label="Price: Low to High" value="price_asc" />
            <Picker.Item label="Price: High to Low" value="price_desc" />
            <Picker.Item label="Most Popular" value="popular" />
          </Picker>
        </View>
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  optionContainer: {
    marginVertical: 16,
  },
  optionLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  priceInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    width: '48%',
    height: 40,
    marginTop: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default CollapsibleFilter;
