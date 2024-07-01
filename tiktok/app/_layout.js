// app/_layout.js
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './utils/AuthContext';

function AppStack() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        // console.log('User is authenticated, redirecting to tabs.');
        router.replace('/(tabs)');
      } else {
        // console.log('User is not authenticated, redirecting to login.');
        router.replace('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppStack />
    </AuthProvider>
  );
}
