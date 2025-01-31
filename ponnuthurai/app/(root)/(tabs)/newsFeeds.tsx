import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { icons } from "@/constants/icons";
import image from "@/constants/images";

const NewsFeeds = () => {
  const [isLiked, setIsLiked] = useState(false);

  // Sample post data
  const post = {
    id: 1,
    title: "Gold Price Hits New High",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    date: "27 Jan 2025",
    image: image.japan, 
    likes: 245,
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    // Add share functionality
    console.log("Share pressed");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="w-full h-[100px] bg-primary-100 justify-end pb-4">
        <Text className="text-white text-2xl font-rubik-medium text-center">
          News Feeds
        </Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Post Card */}
        <View className="mt-4 bg-white rounded-lg shadow-lg border border-gray-200 mb-4">
          {/* Post Header */}
          <View className="p-4">
            <Text className="text-xl font-rubik-medium text-primary-100 mb-2">
              {post.title}
            </Text>
            <Text className="text-gray-500 text-sm font-rubik mb-2">
              {post.date}
            </Text>
          </View>

          {/* Post Image */}
          <Image
            source={post.image}
            className="w-full h-[200px]"
            resizeMode="cover"
          />

          {/* Post Content */}
          <View className="p-4">
            <Text className="text-gray-800 font-rubik leading-6">
              {post.content}
            </Text>
          </View>

          {/* Divider */}
          <View className="h-[1px] bg-gray-200" />

          {/* Like and Share Buttons */}
          <View className="flex-row justify-between p-4">
            {/* Like Button */}
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={handleLike}
            >
              <Image
                source={isLiked ? icons.heart : icons.heart}
                className="w-6 h-6 mr-2"
                tintColor={isLiked ? "#FF4D67" : "#666"}
                resizeMode="contain"
              />
              <Text className={`font-rubik ${isLiked ? "text-[#FF4D67]" : "text-gray-600"}`}>
                {post.likes + (isLiked ? 1 : 0)} Likes
              </Text>
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={handleShare}
            >
              <Image
                source={icons.chat}
                className="w-6 h-6 mr-2"
                tintColor="#666"
                resizeMode="contain"
              />
              <Text className="text-gray-600 font-rubik">
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewsFeeds;