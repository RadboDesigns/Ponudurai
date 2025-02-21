import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { icons } from "@/constants/icons";
import { router } from "expo-router";
import { BACKEND_URL } from '@/config/DjangoConfig';

const Schemes = () => {
  const { type } = useLocalSearchParams();
  const [joinerName, setJoinerName] = useState('');
  const [amount, setAmount] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleJoin = async () => {
    if (!isChecked) {
      Alert.alert('Error', 'Please agree to the terms and conditions to join');
      return;
    }
  
    if (!joinerName || !amount) {
      Alert.alert('Error', 'Please enter your name and the amount');
      return;
    }
  
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 500) {
      Alert.alert('Error', 'Amount must be greater than ₹500');
      return;
    }
  
    // Prepare data to send to the backend
    const joinData = {
      Name: joinerName,
      payAmount: amountNumber,
      chosenPackage: type, // Assuming `type` is passed from the previous screen
      phone: '1234567890', // Replace with the actual user's phone number (from AsyncStorage or context)
    };
  
    try {
      // Send data to the backend
      const response = await fetch(`${BACKEND_URL}/join_scheme/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(joinData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to join the scheme');
      }
  
      const responseData = await response.json();
      Alert.alert('Success', 'You have successfully joined the scheme!');
      router.replace('/(root)/(tabs)'); // Redirect to the index page
    } catch (error: any) {
      console.error('Join Scheme Error:', error);
      Alert.alert('Error', error.message || 'Failed to join the scheme. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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
            Join Schemes
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 mb-[319]">
        <View className="mt-6 mx-4 pb-6">
          <View className="w-[370] h-[157] bg-primary-200 rounded-lg p-4">
            <Text className="text-xl font-rubik-medium text-primary-100 mb-4">
              Ponnudurai - {type}
            </Text>
            <View className="w-full h-[1px] bg-primary-100 mb-4" />
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-rubik text-gray-700">
                Minimum Amount Payable
              </Text>
              <Text className="text-base font-rubik-medium text-primary-100">
                ₹500
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-rubik text-gray-700">
                Duration
              </Text>
              <Text className="text-base font-rubik-medium text-primary-100">
                {type}
              </Text>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View className="mt-6">
            <Text className="text-[22px] font-rubik-bold text-primary-100 mb-4">
              விதிமுறைகள்
            </Text>
            <View className="space-y-2">
                <Text className="text-base font-rubik text-gray-700 ml-3">
                  1. எங்களுடைய பொன்னுத்துரை சேமிப்பு திட்டத்தில் நீங்கள் செலுத்தும் தொகை, அன்றைய சந்தை நிலவரத்தின் அடிப்படையில் 916 தங்கம் எடையாக சேமிக்கப்படும்.
                </Text>
                <Text className="text-base font-rubik text-gray-700 ml-3">
                  2. எங்கள் APP வழியாக பணம் செலுத்தும் போது, ஒரு கிராமிற்கு ரூ.50 வரை தள்ளுபடி வழங்கப்படும்.
                </Text>
                <Text className="text-base font-rubik text-gray-700 ml-3">
                  3. வருட முடிவில், நீங்கள் சேமித்து வைத்துள்ள மொத்த தங்க எடைக்கு 916 ஹால் மார்க் தங்க நகையை பெறலாம்.
                </Text>
                <Text className="text-base font-rubik text-gray-700 ml-3">
                  4. இந்த திட்டத்திற்கு மேக்கிங் சார்ஜ் மற்றும் கழிவுகள் பொருந்தாது. இந்த சலுகை சில நகைகளுக்கு பொருந்தாது. சேமிக்கப்பட்ட தொகை எந்த காரணத்திற்காகவும் ரொக்கமாக வழங்கப்படாது.
                </Text>
                <Text className="text-base font-rubik text-gray-700 ml-3">
                  5. நீங்கள் வாங்கும் நகைக்கு 3% GST பொருந்தும்
                </Text>
                <Text className="text-base font-rubik text-gray-700 ml-3">
                  6. இந்த சேமிப்பு திட்டத்தை முடிக்கும்போது, பதிவு செய்யப்பட்ட மொபைல் எண்ணுக்கு அனுப்பப்படும் OTP மூலம் மட்டுமே கணக்கு முடிக்கப்படும்.
                </Text>
                <Text className="text-base font-rubik text-gray-700">
                விதிமுறைகள் மற்றும் நிபந்தனைகள் நிர்வாகத்திற்கு உட்பட்டது 
                </Text>
              </View>

              <Text className="text-[22px] font-rubik-bold text-primary-100 mb-4">
              Terms & Conditions
              </Text>

              <View className="space-y-2">
                <Text className="text-base font-rubik text-gray-700 ml-3">
                  1. The amount you contribute to our daily savings plan will be recorded as 916 gold weight based on the market rate of that day..
                </Text>
                <Text className="text-base font-rubik text-gray-700 ml-3">
                  2. Get a discount of ₹50 per gram on payments made through our APP.
                </Text>
                <Text className="text-base font-rubik text-gray-700 ml-3">
                  3. At the end of the year, you can redeem 916 Hallmark gold jewelry equivalent to the total gold weight you have saved.
                </Text>
                <Text className="text-base font-rubik text-gray-700 ml-3">
                  4. No making charges or wastage will be applied under this scheme. This offer is not valid on selected jewelry items. Savings cannot be refunded as cash under any circumstances.
                </Text>
                <Text className="text-base font-rubik text-gray-700 ml-3">
                  5. A 3% GST will be applicable on the jewelry you purchase.
                </Text>
                <Text className="text-base font-rubik text-gray-700 ml-3">
                  6. The account can only be closed using the OTP sent to your registered mobile number at the time of completing this savings plan.
                </Text>
                <Text className="text-base font-rubik text-gray-700">
                Terms & Conditions are subject to administration
                </Text>
              </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Join Form at Bottom */}
      <View className="absolute bottom-0 w-full h-[280] bg-white border-t border-gray-200 p-4">
        <Text className="text-base font-rubik-medium text-gray-800 mb-2">
          Joiner's Name
        </Text>
        <TextInput
          className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-2"
          placeholder="Enter your name"
          value={joinerName}
          onChangeText={setJoinerName}
        />

        <Text className="text-base font-rubik-medium text-gray-800 mb-2">
          Enter Scheme Amount
        </Text>
        <TextInput
          className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-2"
          placeholder="Enter amount (₹)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-base font-rubik text-gray-700">
            Agree Terms & Conditions
          </Text>
          <TouchableOpacity 
            onPress={() => setIsChecked(!isChecked)}
            className="w-6 h-6 border border-gray-400 rounded justify-center items-center"
          >
            {isChecked && (
              <View className="w-4 h-4 bg-primary-100 rounded" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleJoin}
          className="w-full h-12 bg-primary-100 rounded-lg justify-center items-center"
        >
          <Text className="text-white text-lg font-rubik-medium">
            Join
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Schemes;