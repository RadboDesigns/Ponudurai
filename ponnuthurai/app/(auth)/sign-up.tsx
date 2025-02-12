import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '@/config/FirebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '@/constants/images';

// Function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to save user to Django backend
const saveUserToBackend = async (email: string, password: string) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/user/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email,
        password
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save user');
    }

    return await response.json();
  } catch (error) {
    throw new Error('Failed to save user to backend');
  }
};

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enteredOTP, setEnteredOTP] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const router = useRouter();

  const showNotification = (message: string) => {
    Alert.alert('Notice', message);
  };

  const checkExistingAccount = async (email: string) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleSignUp = async () => {
    try {
      if (!email || !password) {
        showNotification('Please enter both email and password');
        return;
      }

      setLoading(true);

      // Check if account already exists
      const exists = await checkExistingAccount(email);
      if (exists) {
        showNotification('An account with this email already exists. Please login instead.');
        return;
      }

      // Generate and store OTP
      const otp = generateOTP();
      setGeneratedOTP(otp);
      
      // Here you would typically send the OTP to the user's email
      // For development, we'll show it in a notification
      showNotification(`Development OTP: ${otp}`);
      
      // Show OTP modal
      setShowOtpModal(true);

    } catch (error: any) {
      console.error('Sign Up Error:', error);
      showNotification(error.message || 'Failed to register. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      if (!enteredOTP) {
        showNotification('Please enter the OTP');
        return;
      }

      setLoading(true);

      if (enteredOTP === generatedOTP) {
        // Create user in Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Save user to Django backend after successful OTP verification
        await saveUserToBackend(email, password);

        await AsyncStorage.setItem('lastActiveTimestamp', Date.now().toString());
        showNotification('Account created successfully!');
        setShowOtpModal(false);
        router.replace('/(root)/(tabs)');
      } else {
        showNotification('Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('OTP Verification Error:', error);
      showNotification('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setLoading(true);
      const newOTP = generateOTP();
      setGeneratedOTP(newOTP);
      // For development, show OTP in notification
      showNotification(`Development OTP: ${newOTP}`);
    } catch (error) {
      console.error('Resend OTP Error:', error);
      showNotification('Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        showNotification('Please enter both email and password');
        return;
      }

      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      await AsyncStorage.setItem('lastActiveTimestamp', Date.now().toString());
      showNotification('Login successful!');
      router.replace('/(root)/(tabs)');
    } catch (error: any) {
      console.error('Login Error:', error);
      showNotification('Failed to login. Please check your credentials.');
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
          className="bg-blue-500 rounded-lg p-4 mb-4"
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text className="text-white text-center font-bold">
            {loading ? 'Processing...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

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

      {/* OTP Verification Modal */}
      <Modal
        visible={showOtpModal}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-[80%]">
            <Text className="text-lg font-rubik-medium text-center mb-4">
              Enter OTP
            </Text>
            
            <Text className="text-sm text-gray-600 text-center mb-4">
              Please enter the 6-digit code sent to your email
            </Text>
            
            <TextInput
              className="border border-gray-300 rounded-lg p-4 mb-4"
              placeholder="Enter 6-digit OTP"
              value={enteredOTP}
              onChangeText={setEnteredOTP}
              keyboardType="numeric"
              maxLength={6}
            />

            <TouchableOpacity
              className="bg-blue-500 rounded-lg p-4 mb-2"
              onPress={verifyOTP}
              disabled={loading}
            >
              <Text className="text-white text-center font-bold">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-500 rounded-lg p-4 mb-2"
              onPress={resendOTP}
              disabled={loading}
            >
              <Text className="text-white text-center font-bold">
                Resend OTP
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}