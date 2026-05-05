import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export const CardSkeleton = () => {
  const fadeAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View className="flex flex-col mt-4 p-3 rounded-2xl bg-white shadow-sm shadow-zinc-300">
        {/* Image Skeleton */}
        <View className="w-full h-40 bg-zinc-200 rounded-xl" />

        {/* Text Lines Skeletons */}
        <View className="mt-3 flex flex-col gap-2">
          <View className="w-3/4 h-4 bg-zinc-200 rounded-md" />
          <View className="w-1/2 h-4 bg-zinc-200 rounded-md" />
          <View className="flex flex-row justify-between items-center mt-2">
            <View className="w-1/3 h-5 bg-zinc-200 rounded-md" />
            <View className="w-6 h-6 bg-zinc-200 rounded-full" />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export const SkeletonContainer = ({ count = 6 }: { count?: number }) => {
  return (
    <View className="flex flex-row flex-wrap justify-between px-5 mt-2">
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} className="w-[47%] mb-5">
          <CardSkeleton />
        </View>
      ))}
    </View>
  );
};
