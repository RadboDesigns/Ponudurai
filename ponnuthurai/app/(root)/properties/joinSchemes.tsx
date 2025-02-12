import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { router } from "expo-router";
import { icons } from "@/constants/icons";
import image from "@/constants/images";

interface Banner {
    id: number;
    image: any; // Update this type based on your image import type
    title: string;
    subtitle: string;
}

const JoinSchemes = () => {
    const handleBack = () => {
        router.back();
    };

    const handleSchemePress = (schemeType: string) => {
        // Navigate to the respective scheme page
        router.push({
            pathname: "/(root)/properties/schemes", // Assuming you have a schemes.tsx file in your app directory
            params: {
                type: schemeType.toLowerCase(),
            }
        });
    };

    const banners: Banner[] = [
        { id: 1, image: image.banner1, title: "Daily", subtitle: "Daily Access" },
        { id: 2, image: image.banner1, title: "Weekly", subtitle: "Weekly Access"},
        { id: 3, image: image.banner1, title: "Monthly", subtitle: "Monthly Access"},
    ];

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
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

            <ScrollView className="flex-1 px-4">
                {/* Plans Section */}
                <View className="mt-6">
                    {banners.map((banner) => (
                        <TouchableOpacity 
                            key={banner.id} 
                            className="bg-white rounded-lg shadow-lg border border-gray-200 mb-4"
                            onPress={() => handleSchemePress(banner.title)}
                            activeOpacity={0.7}
                        >
                            {/* Plan Container */}
                            <View className="p-4">
                                {/* Plan Header */}
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-xl font-rubik-medium text-primary-100">
                                        {banner.title}
                                    </Text>
                                </View>

                                {/* Plan Image */}
                                <View className="w-full h-[160px] rounded-lg overflow-hidden mb-3">
                                    <Image
                                        source={banner.image}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </View>
                                
                                {/* Plan Description */}
                                <Text className="text-base font-rubik text-gray-600">
                                    {banner.subtitle}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default JoinSchemes;