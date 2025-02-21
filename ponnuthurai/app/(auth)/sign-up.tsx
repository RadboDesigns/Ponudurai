import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '@/config/FirebaseConfig';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '@/constants/images';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { BACKEND_URL } from '@/config/DjangoConfig';

// Function to check for existing user in backend
const checkExistingUserInBackend = async (phoneNumber: string) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/check-user/?phone=${encodeURIComponent(phoneNumber)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error('Failed to check user existence');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('User check error:', error);
    return { phone_exists: false };
  }
};

// Function to save user to Django backend
const saveUserToBackend = async (userData: {
  email: string;
  password: string;
  phoneNumber: string;
  firebaseUid: string;
}) => {
  try {
    const response = await fetch(`${BACKEND_URL}/user/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        phone_number: userData.phoneNumber,
        firebase_uid: userData.firebaseUid,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail ||
        errorData.phone_number?.[0] ||
        'Validation error'
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Backend save error:', error);
    throw error;
  }
};

const defaultRecaptchaProps = {
  title: "Prove you're human",
  cancelLabel: "Close",
  languageCode: "en"
};

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const router = useRouter();
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const handleLogin = () => {
    router.push('/sign-in');
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const sendOTP = async () => {
    try {
      if (!validatePhoneNumber(phoneNumber)) {
        Alert.alert('Error', 'Please enter a valid 10-digit phone number');
        return;
      }

      setLoading(true);

      // Check if user exists in backend
      const existingUser = await checkExistingUserInBackend(phoneNumber);
      if (existingUser.phone_exists) {
        Alert.alert('Error', 'An account with this phone number already exists');
        setLoading(false);
        return;
      }

      // Initialize Firebase phone auth
      const phoneProvider = new PhoneAuthProvider(auth);
      const formattedPhoneNumber = `+91${phoneNumber}`; // Add country code for India

      if (!recaptchaVerifier.current) {
        throw new Error('Recaptcha verifier not initialized');
      }

      const verificationId = await phoneProvider.verifyPhoneNumber(
        formattedPhoneNumber,
        recaptchaVerifier.current
      );

      setVerificationId(verificationId);
      setShowOtpModal(true);
      Alert.alert('Success', 'OTP has been sent to your phone number');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    try {
      setLoading(true);

      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );

      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      await saveUserToBackend({
        email,
        password,
        phoneNumber,
        firebaseUid: user.uid,
      });

      await AsyncStorage.setItem('userPhoneNumber', phoneNumber);

      Alert.alert('Success', 'Registration successful!', [
        {
          text: 'OK',
          onPress: () => router.replace('/')
        }
      ]);
    } catch (error: any) {
      console.error('Verification error:', error);
      Alert.alert('Error', error.message || 'OTP verification failed');
    } finally {
      setLoading(false);
      setShowOtpModal(false);
    }
  };

  return (
    <ScrollView className="bg-white flex-1">
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
        attemptInvisibleVerification={false}
        {...defaultRecaptchaProps}
      />

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

          <View className="flex-row items-center border border-gray-300 rounded-lg mb-4">
            <TextInput
              className="flex-1 p-4"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 mb-4"
          onPress={sendOTP}
          disabled={loading}
        >
          <Text className="text-white text-center font-bold">
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-green-500 rounded-lg p-4"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white text-center font-bold">
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showOtpModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOtpModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-center font-rubik text-primary-100 text-xl mb-4">
              Enter OTP
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 mb-4"
              placeholder="Enter OTP"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity
              className="bg-blue-500 rounded-lg p-4"
              onPress={verifyOTP}
              disabled={loading}
            >
              <Text className="text-white text-center font-bold">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}