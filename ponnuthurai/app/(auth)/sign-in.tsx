import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { BACKEND_URL } from '@/config/DjangoConfig';
import images from '@/constants/images';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }

      setLoading(true);

      // Check if the user exists in the backend
      const response = await fetch(`${BACKEND_URL}/user/check/`, {
        method: 'POST',
        headers: {2
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('User not found or invalid credentials');
      }

      const userData = await response.json();

      // If user exists, redirect to the index page
      if (userData.exists) {
        router.replace('/(root)/(tabs)'); // Redirect to the index page
      } else {
        Alert.alert('Error', 'User does not exist');
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      Alert.alert('Error', error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="bg-white flex-1">
      <View className="items-center">
        <Image
          source={images.onboarding}
          className="w-[450px] h-[250px]"
          resizeMode="contain"
        />
      </View>

      <View className="px-6">
        <Text className="text-center font-rubik text-primary-100 text-2xl mt-10">
          Welcome to{"\n"}
          <Text className="text-3xl font-rubik-semibold text-primary-100">
            Ponnudurai Digi
            <Text className="text-accent-100">Gold</Text>
          </Text>
        </Text>

        <View className="mt-4 space-y-4">
          <View className="flex-row items-center border border-gray-300 rounded-lg mb-4">
            <TextInput
              className="flex-1 p-4"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="flex-row items-center border border-gray-300 rounded-lg mb-4">
            <TextInput
              className="flex-1 p-4"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
        </View>

        <TouchableOpacity
          className="bg-green-500 rounded-lg p-4"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white text-center font-bold">
            {loading ? 'Processing...' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}