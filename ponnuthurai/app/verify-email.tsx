import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { auth } from '@/config/FirebaseConfig';
import { applyActionCode } from 'firebase/auth';
import { BACKEND_URL } from '@/config/DjangoConfig';

export default function VerifyEmail() {
  const router = useRouter();
  const { oobCode } = useLocalSearchParams();

  useEffect(() => {
    const verifyEmailAndRedirect = async () => {
      try {
        if (!oobCode) {
          throw new Error('No verification code provided');
        }

        // Verify the email
        await applyActionCode(auth, oobCode as string);
        
        // Get current user
        const user = auth.currentUser;
        if (!user) {
          throw new Error('No user found');
        }

        // Reload user to get updated email verification status
        await user.reload();
        
        // Update backend with verification status
        await fetch(`${BACKEND_URL}/user/verify-email/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            firebase_uid: user.uid
          }),
        });

        // Redirect to index page after successful verification
        router.replace('/');
      } catch (error) {
        console.error('Verification error:', error);
        // Redirect to error page or show error message
        router.replace('/verification-error');
      }
    };

    verifyEmailAndRedirect();
  }, [oobCode]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#0000ff" />
      <Text className="mt-4 text-lg">Verifying your email...</Text>
    </View>
  );
}