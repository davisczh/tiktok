// app/tabs/_layout.js
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs >
      <Tabs.Screen 
        name="index" 
        options={{ tabBarLabel: 'Home', title: 'Home' }} 
      />
      <Tabs.Screen 
        name="market" 
        options={{ tabBarLabel: 'Market', title: 'Market' }} 
      />
    </Tabs>
  );
}