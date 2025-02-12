// components/LoadingScreen.tsx
import { View, ActivityIndicator } from 'react-native';
import React from 'react';

export default function LoadingScreen() {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}