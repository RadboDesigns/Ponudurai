import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Linking } from 'react-native';
import React from 'react';

const Support = () => {
  const phoneNumber = '1-800-123-4567'; // Replace with your actual toll-free number

  const handlePhonePress = () => {
    Linking.openURL(`tel:${phoneNumber.replace(/\D/g, '')}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="w-full h-[100px] bg-primary-100 justify-end pb-4">
        <Text className="text-white text-2xl font-rubik-medium text-center">
          Support
        </Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Toll Free Section */}
        <View className="mt-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-800 text-lg font-rubik">
              Toll Free:
            </Text>
            <TouchableOpacity 
              onPress={handlePhonePress}
              className="bg-white px-4 py-2 rounded-md"
            >
              <Text className="text-primary-100 text-lg font-rubik">
                {phoneNumber}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Support;