import { View, Text, SafeAreaView, ScrollView, Image, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { BACKEND_URL, API_CONFIG } from '@/config/DjangoConfig';
import image from "@/constants/images";

interface Feed {
  id: number;
  feedsTitle: string;
  context: string;
  created_at: string;
  joiningDate: string;
  image: string | null;
}

const NewsFeeds = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<{[key: number]: boolean}>({});

  const fetchFeeds = async () => {
    try {
      setError(null);
      const response = await fetch(`${BACKEND_URL}/Feeds/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setFeeds(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching feeds:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchFeeds();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return null;
    
    // If the URL is already absolute (starts with http:// or https://)
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Remove any leading slash to avoid double slashes
    const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
    return `${BACKEND_URL}/${cleanImageUrl}`;
  };

  const handleImageError = (feedId: number) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [feedId]: true
    }));
    console.log(`Image load failed for feed ${feedId}`);
  };

  const renderFallbackImage = () => (
    <View className="w-full h-[200px] bg-gray-200 items-center justify-center">
      <Text className="text-gray-600 font-rubik">Image not available</Text>
    </View>
  );

  const renderFeed = (feed: Feed) => {
    const imageUrl = getImageUrl(feed.image);
    const hasImageError = imageLoadErrors[feed.id];

    return (
      <View key={feed.id} className="mt-4 bg-white rounded-lg shadow-lg border border-gray-200 mb-4">
        {/* Post Header */}
        <View className="p-4">
          <Text className="text-xl font-rubik-medium text-primary-100 mb-2">
            {feed.feedsTitle}
          </Text>
          <Text className="text-gray-500 text-sm font-rubik mb-2">
            {formatDate(feed.created_at)}
          </Text>
        </View>

        {/* Post Image */}
        {imageUrl && !hasImageError ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-[200px]"
            resizeMode="cover"
            onError={() => handleImageError(feed.id)}
          />
        ) : renderFallbackImage()}

        {/* Post Content */}
        <View className="p-4">
          <Text className="text-gray-800 font-rubik leading-6">
            {feed.context}
          </Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center mt-4">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (error) {
      return (
        <View className="mt-4 p-4 bg-red-100 rounded-lg">
          <Text className="text-red-600 font-rubik text-center">{error}</Text>
        </View>
      );
    }

    if (feeds.length === 0) {
      return (
        <View className="flex-1 justify-center items-center mt-4">
          <Text className="text-center text-gray-600 font-rubik">
            No news feeds available
          </Text>
        </View>
      );
    }

    return feeds.map(renderFeed);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="w-full h-[100px] bg-primary-100 justify-end pb-4">
        <Text className="text-white text-2xl font-rubik-medium text-center">
          News Feeds
        </Text>
      </View>

      <ScrollView 
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewsFeeds;