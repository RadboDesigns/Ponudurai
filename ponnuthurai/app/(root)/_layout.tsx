// app/(root)/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="properties/PhoneSignIn" />
      <Stack.Screen name="properties/Privacy" />
      <Stack.Screen name="properties/joinSchemes" />
      <Stack.Screen name="properties/mySchemes" />
      <Stack.Screen name="properties/schemes" />
    </Stack>
  );
}