import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';

const Payment = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="w-full h-[100px] bg-primary-100 justify-end pb-4">
        <Text className="text-white text-2xl font-rubik-medium text-center">
          Payments
        </Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Payment Card */}
        <View className="mt-4 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <View className="flex-row justify-between items-start mb-3">
            <Text className="text-gray-600 font-rubik">Scheme Name</Text>
            <Text className="text-primary-100 font-rubik-medium">₹3000</Text>
          </View>

          <View className="flex-row justify-between items-start mb-3">
            <Text className="text-lg text-primary-100 font-rubik-medium">PD2025-Raja</Text>
            <Text className="text-gray-600 font-rubik">Payment Status</Text>
          </View>

          <View className="flex-row justify-between items-start mb-3">
            <Text className="text-gray-600 font-rubik">Purchase gold</Text>
            <Text className="text-green-500 font-rubik-medium">Successful</Text>
          </View>

          <View className="flex-row justify-between items-start">
            <Text className="text-gray-600 font-rubik">3.500gram</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Payment;