import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { router } from "expo-router";
import { icons } from "@/constants/icons";
import image from "@/constants/images";

const Privacy = () => {

    const { type } = useLocalSearchParams();
    const handleBack = () => {
        router.back();
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
                    Privacy Policy
                </Text>
            </View>
        </View>

        <ScrollView className="flex-1 ">
          <View className="mt-6 mx-4 pb-6">

            {/* Tamil Title */}
            <View className="mt-6">
              <Text className="text-[22px] font-rubik-bold text-primary-100 mb-4">
              Privacy Policy
              </Text>
              
              {/* Points */}
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

        
    </SafeAreaView>
  )
}

export default Privacy