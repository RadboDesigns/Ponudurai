import { View, Text, Image, ScrollView, ToastAndroid, Platform, Alert, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../constants/images';
import { Link, useRouter } from "expo-router";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/config/FirebaseConfig';

// Constants
const INACTIVITY_THRESHOLD = 7 * 24 * 60 * 60 * 1000;
const LAST_ACTIVE_KEY = 'lastActiveTimestamp';
const BACKEND_URL = 'http://127.0.0.1:8000/user/';

const SignUp = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = React.useRef(null);

  useEffect(() => {
    checkLastActive();
    updateLastActive();
  }, []);

  const checkLastActive = async () => {
    try {
      const lastActive = await AsyncStorage.getItem(LAST_ACTIVE_KEY);
      if (lastActive) {
        const timeDiff = Date.now() - parseInt(lastActive);
        if (timeDiff > INACTIVITY_THRESHOLD) {
          await auth.signOut();
          await AsyncStorage.removeItem(LAST_ACTIVE_KEY);
          showNotification('Session expired due to inactivity');
          router.replace('/sign-in');
        }
      }
    } catch (error) {
      console.error('Error checking last active:', error);
    }
  };

  const updateLastActive = async () => {
    try {
      await AsyncStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error updating last active:', error);
    }
  };

  const showNotification = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.BOTTOM);
    } else {
      Alert.alert('Notice', message);
    }
  };

  const formatPhoneNumber = (number: string) => {
    if (!number.startsWith('+')) {
      return '+' + number;
    }
    return number;
  };

  const saveUserToBackend = async (phone: string) => {
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save user data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving to backend:', error);
      throw error;
    }
  };

  const OnCreateAccount = async () => {
    if (!phoneNumber) {
      showNotification("Please enter your phone number");
      return;
    }

    try {
      setLoading(true);
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      
      // Use the expo-firebase-recaptcha verifier
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(
        formattedPhoneNumber,
        recaptchaVerifier.current
      );
      
      setVerificationId(verificationId);
      setModalVisible(true);
      showNotification("Verification code sent!");
    } catch (error: any) {
      console.error('Error sending code:', error);
      showNotification(error.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    try {
      setLoading(true);
      if (!verificationCode || verificationCode.length !== 6) {
        showNotification("Please enter a valid 6-digit code");
        return;
      }

      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );

      await signInWithCredential(auth, credential);
      await saveUserToBackend(phoneNumber);
      await updateLastActive();
      
      showNotification("Phone number verified and account created successfully!");
      setModalVisible(false);
      router.replace('/(root)/(tabs)');
    } catch (error: any) {
      console.error('Error in verification process:', error);
      if (error.code?.includes('auth')) {
        showNotification("Invalid verification code");
      } else {
        showNotification("Verification successful but failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
          
          <View className="mt-4 space-y-4">
            <InputField
              label="Phone Number"
              placeholder="Enter phone number with country code (+1234567890)"
              textContentType="telephoneNumber"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <CustomButton 
            title={loading ? "Please wait..." : "Create Account"}
            onPress={OnCreateAccount}
            className="mt-6 bg-primary-100 w-full rounded-lg"
            disabled={loading}
          />

          <Link href="/sign-in" asChild>
            <Text className="text-lg text-center text-general-200 mt-5">
              Already have an account?{' '}
              <Text className="text-secondary-200 text-primary-100">Sign In</Text>
            </Text>
          </Link>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => !loading && setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-[80%]">
            <Text className="text-xl font-rubik-semibold mb-4">
              Enter Verification Code
            </Text>
            <InputField
              placeholder="Enter 6-digit code"
              keyboardType="number-pad"
              value={verificationCode}
              onChangeText={setVerificationCode}
              maxLength={6}
            />
            <View className="flex-row justify-end mt-4 space-x-2">
              <CustomButton
                title="Cancel"
                onPress={() => !loading && setModalVisible(false)}
                bgVariant="danger"
                className="flex-1"
                disabled={loading}
              />
              <CustomButton
                title={loading ? "Verifying..." : "Verify"}
                onPress={verifyCode}
                className="flex-1"
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SignUp;