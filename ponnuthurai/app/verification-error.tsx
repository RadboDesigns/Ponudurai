import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function VerificationError() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-xl text-red-500 mb-4">Verification Failed</Text>
      <Text className="text-center mb-6">
        We couldn't verify your email. The link may have expired or already been used.
      </Text>
      <TouchableOpacity
        className="bg-blue-500 rounded-lg px-6 py-3"
        onPress={() => router.replace('/')}
      >
        <Text className="text-white font-bold">Return to Home</Text>
      </TouchableOpacity>
    </View>
  );
}