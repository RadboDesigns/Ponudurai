import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link, router } from "expo-router";
import React from 'react';
import { icons } from "@/constants/icons";

const MySchemes = () => {
  const handleBack = () => {
    router.back();
  };

  const progress = 0.5; // 50% progress (6 months out of 12)

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="w-full h-[100px] bg-primary-100 justify-end pb-4">
        <View className="flex-row items-center px-4">
          <TouchableOpacity onPress={handleBack} className="absolute left-4 z-10">
            <Image 
              source={icons.backArrow}
              className="w-6 h-6"
              tintColor="white"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text className="flex-1 text-white text-2xl font-rubik-medium text-center">
            My Schemes
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Scheme Box */}
        <View className="mt-6 bg-white rounded-lg shadow-lg border border-gray-200 w-[371px] h-[320px]">
          <View className="p-6">
            {/* Title */}
            <Text className="text-xl font-rubik-medium text-center text-primary-100 mb-4">
              PD2025 - RAJA
            </Text>

            {/* Divider Line */}
            <View className="h-[1px] bg-gray-200 mb-4" />

            {/* Remaining Months */}
            <Text className="text-lg font-rubik text-primary-100 mb-4">
              Remaining months - 6
            </Text>

            {/* Progress Bar */}
            <View className="h-2 bg-gray-200 rounded-full mb-2">
              <View 
                className="h-full bg-primary-100 rounded-full"
                style={{ width: `${progress * 100}%` }}
              />
            </View>

            {/* Scheme Details */}
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-rubik-semibold text-primary-100">
                Scheme
              </Text>
              <Text className="text-base font-rubik text-gray-600">
              PONNUDURAI - MONTHLY
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-base font-rubik-semibold text-primary-100">
              Installment
              </Text>
              <Text className="text-base font-rubik text-gray-600">
                
                12 Months
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-base font-rubik-semibold text-primary-100">
              Scheme Type
              </Text>
              <Text className="text-base font-rubik text-gray-600">
                Gold
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-base font-rubik-semibold text-primary-100">
              Close Date
              </Text>
              <Text className="text-base font-rubik text-gray-600">
                25-01-2025
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-base font-rubik-semibold text-primary-100">
              Total Savings
              </Text>
              <Text className="text-base font-rubik text-gray-600">
                4.896 Grams 
              </Text>
            </View>
            <Link 
              href={"/"} 
              className="bg-primary-100 px-8 py-3 rounded-full mb-4 w-full mt-5"
            >
              <Text className="text-white text-center font-rubik-medium text-lg">
                Pay
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MySchemes;