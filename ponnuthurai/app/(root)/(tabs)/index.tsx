import { Link, router } from "expo-router";
import { Text, View, Image, TouchableOpacity, Animated, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import image from "@/constants/images";
import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';

const BACKEND_URL = 'http://127.0.0.1:8000/live_prices/';

interface PriceData {
  gold_price: number;
  silver_price: number;
  timestamp?: string;
}

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  const [priceData, setPriceData] = useState<PriceData>({
    gold_price: 0,
    silver_price: 0,
  });
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setPriceData(data);
      setLastUpdated(format(new Date(), "hh:mm a dd-MMM-yyyy"));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    // Fetch prices every 5 minutes
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const progress = 0.5;

  const handleMySchemePress = () => {
    router.push("/mySchemes");
  };

  const handleJoinSchemePress = () => {
    router.push("/joinSchemes");
  };

  const paymentPage = () => {
    router.push("/(root)/(tabs)/payment");
  };

  const supportPage = () => {
    router.push("/(root)/(tabs)/support");
  };

  const privacyPolicy = () => {
    router.push("/Privacy");
  };

  const toggleMenu = () => {
    const toValue = isMenuOpen ? -300 : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  const banners = [
    { id: 1, image: image.banner1 },
    { id: 2, image: image.banner1 },
    { id: 3, image: image.banner1 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Side Navigation Menu */}
      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }],
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 300,
          zIndex: 50,
        }}
        className="bg-primary-100"
      >
        {/* Menu Header */}
        <View className="flex-row items-center justify-between px-6 py-4 mt-12">
          <Text className="text-white text-3xl font-rubik-medium">Menu</Text>
          <TouchableOpacity onPress={toggleMenu}>
            <Image
              source={icons.close}
              className="w-6 h-6"
              tintColor="white"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Menu Divider */}
        <View className="h-[1px] bg-black opacity-20 mx-4" />

        {/* Menu Items */}
        <View className="px-8 py-8">
          <TouchableOpacity className="flex-row items-center mb-4">
            <Image
              source={icons.profile}
              className="w-10 h-10"
              tintColor="white"
              resizeMode="contain"
            />
            <Text className="text-white text-2xl font-rubik ml-6">Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center mb-4" onPress={handleJoinSchemePress}>
            <Image
              source={icons.JOin_Scheme}
              className="w-10 h-10"
              tintColor="white"
              resizeMode="contain"
            />
            <Text className="text-white text-2xl font-rubik ml-6">Join Scheme</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center mb-4" onPress={handleMySchemePress}>
            <Image
              source={icons.My_Scheme}
              className="w-10 h-10"
              tintColor="white"
              resizeMode="contain"
            />
            <Text className="text-white text-2xl font-rubik ml-6">My Scheme</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center mb-4" onPress={paymentPage}>
            <Image
              source={icons.Paymen}
              className="w-10 h-10"
              tintColor="white"
              resizeMode="contain"
            />
            <Text className="text-white text-2xl font-rubik ml-6">Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center mb-4" onPress={supportPage}>
            <Image
              source={icons.Support_2}
              className="w-10 h-10"
              tintColor="white"
              resizeMode="contain"
            />
            <Text className="text-white text-2xl font-rubik ml-6">Support</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center mb-4" onPress={handleMySchemePress}>
            <Image
              source={icons.About}
              className="w-10 h-10"
              tintColor="white"
              resizeMode="contain"
            />
            <Text className="text-white text-2xl font-rubik ml-6">About</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center mb-4" onPress={privacyPolicy}>
            <Image
              source={icons.Privacy}
              className="w-10 h-10"
              tintColor="white"
              resizeMode="contain"
            />
            <Text className="text-white text-2xl font-rubik ml-6">Privacy</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center mb-4" onPress={handleMySchemePress}>
            <Image
              source={icons.logout}
              className="w-10 h-10"
              tintColor="white"
              resizeMode="contain"
            />
            <Text className="text-white text-2xl font-rubik ml-6">Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Main Content */}
        <View className="w-[412px] h-[245px] bg-primary-100">
          {/* Header Content Row */}
          <View className="flex-row items-center justify-between px-4 pt-4 mt-12">
            <TouchableOpacity onPress={toggleMenu}>
              <Image
                source={icons.threeDot}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </TouchableOpacity>

            <Image
              source={image.logo}
              className="w-88 h-70"
              resizeMode="contain"
            />

            <View className="w-8" />
          </View>
          <Text className="color-white text-center text-lg my-10 font-rubik">
            Rate updated on <Text className="text-accent-100">03:14 PM 21-Jan-2025</Text>
          </Text>
        </View>

        {/* Two Separate Price Boxes */}
        <View className="flex-row justify-between px-4 -mt-14">
          {/* Buy Price Box */}
          <View className="w-[178px] h-[99px] bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <View className="flex-row items-start justify-between">
              <Image
                source={icons.silver}
                className="w-8 h-8 mt-5"
                resizeMode="contain"
              />
              <View className="items-end">
                <Text className="text-base font-rubik">Silver Rate</Text>
                <Text className="text-2xl font-rubik-medium text-primary-100">
                  {loading ? "Loading..." : formatPrice(priceData.silver_price)}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center justify-end mt-2">
              <Text className="font-rubik text-gray-700 text-base">per gram</Text>
            </View>
          </View>

          {/* Sell Price Box */}
          <View className="w-[178px] h-[99px] bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <View className="flex-row items-start justify-between">
              <Image
                source={icons.gold}
                className="w-8 h-8 mt-5"
                resizeMode="contain"
              />
              <View className="items-end">
                <Text className="text-base font-rubik">Gold Rate</Text>
                <Text className="text-2xl font-rubik-medium text-accent-100">
                  {loading ? "Loading..." : formatPrice(priceData.gold_price)}
                </Text>
              </View>
            </View>
            <View className="items-end mt-2">
              <TouchableOpacity>
                <Text className="text-primary-100 font-rubik-medium text-base">per gram</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Banner Scrolling Section */}
        <View className="mt-6 mx-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            className="w-[371px] h-[203px]"
          >
            {banners.map((banner) => (
              <View
                key={banner.id}
                className="w-[371px] h-[203px] rounded-lg overflow-hidden mr-4"
              >
                <Image
                  source={banner.image}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* New Rectangular Box */}
        <View className="mt-6 mx-4 w-[371px] h-[126px] bg-white rounded-lg shadow-lg border border-gray-200">
          <View className="flex-row h-full">
            {/* Left Icon Section */}
            <TouchableOpacity
              className="flex-1 items-center justify-center"
              onPress={handleMySchemePress}
            >
              <Image
                source={icons.myScheme}
                className="w-12 h-12 mb-2"
                resizeMode="contain"
              />
              <Text className="text-primary-100 text-lg font-rubik-medium text-center">
                My Scheme
              </Text>
            </TouchableOpacity>

            {/* Divider Line */}
            <View className="w-[1px] h-[80%] bg-gray-300 self-center" />

            {/* Right Icon Section */}
            <TouchableOpacity
              className="flex-1 items-center justify-center"
              onPress={handleJoinSchemePress}
            >
              <Image
                source={icons.joinScheme}
                className="w-12 h-12 mb-2"
                resizeMode="contain"
              />
              <Text className="text-primary-100 text-lg font-rubik-medium text-center">
                Join Scheme
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rest of the content remains the same */}
        <View className="flex-1 items-center px-4 mt-6">
          <Text className="font-bold text-3xl mb-10 font-rubik">
            Your Scheme
          </Text>
          <View className="mt-6 bg-white rounded-lg shadow-lg border border-gray-200 w-[371px] h-[320px]">
            <View className="p-6">
              {/* Title */}
              <Text className="text-xl font-rubik-medium text-center text-primary-100 mb-4">
                PD2025 - RAJA
              </Text>

              {/* Divider Line */}
              <View className="h-[1px] bg-gray-200 mb-4" />

              {/* Remaining Months */}
              <Text className="text-lg font-rubik text-primary-100 mb-4">
                Remaining months - 6
              </Text>

              {/* Progress Bar */}
              <View className="h-2 bg-gray-200 rounded-full mb-2">
                <View
                  className="h-full bg-primary-100 rounded-full"
                  style={{ width: `${progress * 100}%` }}
                />
              </View>

              {/* Scheme Details */}
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-rubik-semibold text-primary-100">
                  Scheme
                </Text>
                <Text className="text-base font-rubik text-gray-600">
                  PONNUDURAI - MONTHLY
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-base font-rubik-semibold text-primary-100">
                  Installment
                </Text>
                <Text className="text-base font-rubik text-gray-600">
                  12 Months
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-base font-rubik-semibold text-primary-100">
                  Scheme Type
                </Text>
                <Text className="text-base font-rubik text-gray-600">
                  Gold
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-base font-rubik-semibold text-primary-100">
                  Close Date
                </Text>
                <Text className="text-base font-rubik text-gray-600">
                  25-01-2025
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-base font-rubik-semibold text-primary-100">
                  Total Savings
                </Text>
                <Text className="text-base font-rubik text-gray-600">
                  4.896 Grams
                </Text>
              </View>
              <Link
                href={"/"}
                className="bg-primary-100 px-8 py-3 rounded-full mb-4 w-full mt-5"
              >
                <Text className="text-white text-center font-rubik-medium text-lg">
                  Pay
                </Text>
              </Link>
            </View>
          </View>

          <Link
            href={"/sign-in"}
            className="bg-primary-100 px-8 py-3 rounded-full mb-4 w-full mt-10"
          >
            <Text className="text-white text-center font-rubik-medium text-lg">
              Sign In
            </Text>
          </Link>

          <Link
            href={"/sign-up"}
            className="bg-accent-100 px-8 py-3 rounded-full mb-4 w-full"
          >
            <Text className="text-white text-center font-rubik-medium text-lg">
              Sign Up
            </Text>
          </Link>

          <View className="mt-8">
            <Link
              href={"/(root)/(tabs)/newsFeeds"}
              className="text-primary-100 font-rubik-medium mb-3"
            >
              News Feeds
            </Link>
            <Link
              href={"/(root)/(tabs)/support"}
              className="text-primary-100 font-rubik-medium"
            >
              Support
            </Link>
          </View>
        </View>
      </ScrollView>

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <TouchableOpacity
          className="absolute inset-0 bg-black/50 z-40"
          onPress={toggleMenu}
        />
      )}
    </SafeAreaView>
  );
}