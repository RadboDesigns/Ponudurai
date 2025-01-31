import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '@/constants/images';
import { Link } from "expo-router";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { icons } from '@/constants/icons';

const sign_up = () => {
  
  const handleLogin = async () => {
    // Handle sign-in logic here
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView>
        <View className="items-center">
          <Image 
            source={images.onboarding} 
            className="w-[450px] h-[250px]" 
            resizeMode="contain" 
          />
        </View>
        <View className="px-6">
          <Text className="text-center font-rubik text-primary-100 text-2xl mt-10">
            Welcome to
            {"\n"} 
            <Text className="text-3xl font-rubik-semibold text-primary-100">
              Ponnudurai Digi
              <Text className="text-accent-100">Gold</Text>
            </Text>
          </Text>
          <Text className="text-lg font-rubik text-black-200 text-center mt-7">
            Your golden moments begin here.
          </Text>

          <Text className='text-lg font-rubik text-black text-center mt-20'>
            Login to ReState with Google
          </Text>
          <TouchableOpacity onPress={handleLogin} className='bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5'>
            
            <View className='flex flex-row items-center justify-center'>
              <Image  
              source={icons.google}
              className='w-5 h-5'
              resizeMode='contain'
              />
              <Text className='text-lg font-rubik-medium text-black ml-2'>Continue with Gooogle</Text> 
            </View>

          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default sign_up;
