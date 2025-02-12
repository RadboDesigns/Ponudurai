import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '@/config/FirebaseConfig';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerifyOTP() {
  const [otp, setOTP] = useState('');
  const router = useRouter();

  const verifyOTP = async () => {
    try {
      // Validate OTP
      if (otp.length !== 6 || !/^\d+$/.test(otp)) {
        Alert.alert('Error', 'Please enter a valid 6-digit OTP');
        return;
      }

      // Retrieve verification ID
      const verificationId = await AsyncStorage.getItem('verificationId');
      console.log('Retrieved Verification ID:', verificationId);
      
      if (!verificationId) {
        Alert.alert('Error', 'Session expired. Please request a new OTP');
        return router.back();
      }

      // Create credential
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      
      // Sign in with credential
      await signInWithCredential(auth, credential);
      
      // Clean up
      await AsyncStorage.removeItem('verificationId');
      
      // Navigate to home screen
      router.replace('/(root)/(tabs)');
    } catch (error) {
      console.error('OTP Verification Error:', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
  };

  return (
    <View className="flex-1 justify-center px-4 bg-white">
      <Text className="text-2xl font-bold mb-8 text-center">Verify OTP</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-4"
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOTP}
        keyboardType="number-pad"
        maxLength={6}
      />
      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-4"
        onPress={verifyOTP}
      >
        <Text className="text-white text-center font-bold">Verify</Text>
      </TouchableOpacity>
    </View>
  );
}