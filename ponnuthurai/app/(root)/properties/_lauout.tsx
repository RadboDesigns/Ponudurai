// app/(root)/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="properties/PhoneSignIn" options={{ headerShown: false }} />
      <Stack.Screen name="properties/Privacy" options={{ headerShown: false }} />
      <Stack.Screen name="properties/joinSchemes" options={{ headerShown: false }} />
      <Stack.Screen name="properties/mySchemes" options={{ headerShown: false }} />
      <Stack.Screen name="properties/schemes" options={{ headerShown: false }} />
    </Stack>
  );
}