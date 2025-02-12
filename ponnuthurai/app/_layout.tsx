import { SplashScreen, Stack, Slot, useSegments, useRouter } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { auth } from '@/config/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require('../assets/fonts/Rubik-Bold.ttf'),
    "Rubik-ExtraBold": require('../assets/fonts/Rubik-ExtraBold.ttf'),
    "Rubik-Light": require('../assets/fonts/Rubik-Light.ttf'),
    "Rubik-Medium": require('../assets/fonts/Rubik-Medium.ttf'),
    "Rubik-Regular": require('../assets/fonts/Rubik-Regular.ttf'),
    "Rubik-SemiBold": require('../assets/fonts/Rubik-SemiBold.ttf')
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Only consider authenticated if user exists AND is verified
      setIsAuthenticated(!!user && user.emailVerified);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!fontsLoaded) return;
    
    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated === false) {
      // Ensure we're in auth group when not authenticated
      if (!inAuthGroup) {
        router.replace('/(auth)/sign-up');
      }
    } else if (isAuthenticated === true) {
      // Navigate to main app when authenticated
      router.replace('/(root)/(tabs)');
    }
  }, [isAuthenticated, segments, fontsLoaded]);

  if (!fontsLoaded) return <Slot />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(root)" options={{ headerShown: false }} />
    </Stack>
  );
}