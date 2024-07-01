// app/(tabs)/index.js
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { useAuth } from '../utils/AuthContext';

const Home = () => {
  const { logout } = useAuth();

  const handleLogOut = () => {
    console.log('Logging out');
    logout();
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Button title="Logout" onPress={handleLogOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
});

export default Home;
