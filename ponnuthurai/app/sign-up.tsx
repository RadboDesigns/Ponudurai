import { View, Text, Image, ScrollView, ToastAndroid, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../constants/images';
import { Link, useRouter } from "expo-router";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '../config/FirebaseConfig';

const sign_up = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const showNotification = (message) => {
    console.log("Showing notification:", message); // Debugging statement
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.BOTTOM);
    } else {
      Alert.alert('Notice', message);
    }
  };

  const OnCreateAccount = async () => {
    console.log("Email:", email); // Debugging statement
    console.log("Password:", password); // Debugging statement

    if (!email || !password) {
      showNotification("Please Fill all details");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);

      // Send email verification
      await sendEmailVerification(user);
      showNotification("Verification email sent. Please check your email.");

      // Check email verification status periodically
      const interval = setInterval(async () => {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(interval);
          setIsEmailVerified(true);
          showNotification("Email verified successfully!");
          router.replace('/(root)/(tabs)'); // Redirect to home page
        }
      }, 5000); // Check every 5 seconds

    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/email-already-in-use") {
        showNotification('Email already exists');
      } else {
        showNotification('An error occurred during sign up');
      }
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

          {/* Input Fields */}
          <View className="mt-4 space-y-4">
            <InputField
              label="Email"
              placeholder="Enter your email"
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="mt-2 space-y-4">
            <InputField
              label="Password"
              placeholder="Enter your password"
              textContentType="password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>