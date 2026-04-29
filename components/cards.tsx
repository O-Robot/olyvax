import icons from "@/constants/icons";
import images from "@/constants/images";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CardProps {
  onPress?: () => void;
  featured?: boolean;
}

export const Card = ({ onPress, featured }: CardProps) => {
  return featured ? (
    <TouchableOpacity className="flex flex-col items-start w-60 h-80 relative">
      <Image source={images.japan} className="size-full rounded-2xl" />
      <Image
        source={images.cardGradient}
        className="size-full rounded-2xl absolute bottom-0"
      />

      <View className="flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5 gap-1">
        <Image source={icons.star} className="size-3.5" />
        <Text className="text-xs font-rubik-bold text-primary">4.4</Text>
      </View>

      <View className="flex flex-col items-start absolute bottom-5 inset-x-5">
        <Text
          className="text-xl font-rubik-extrabold text-white"
          numberOfLines={1}
        >
          Modern Appartment
        </Text>
        <Text className="text-base font-rubik text-white">
          3 Habitat Close, Lekki
        </Text>

        <View className="flex flex-row items-center justify-between w-full pt-3">
          <Text className="text-xl font-rubik-extrabold text-white">
            #3,500
          </Text>
          <Image source={icons.heart} className="size-5" />
        </View>
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity className="flex-1 w-full mt-4 px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/30 relative">
      <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
        <Image source={icons.star} className="size-3.5" />
        <Text className="text-xs font-rubik-bold text-primary">4.4</Text>
      </View>
      <Image source={images.newYork} className="w-full h-40 rounded-lg" />

      <View className="flex flex-col mt-2">
        <Text className="text-base font-rubik-bold text-black">
          Cozy Studio
        </Text>
        <Text className="text-xs font-rubik text-black-200">
          3 Habitat Close, Lekki
        </Text>

        <View className="flex flex-row items-center justify-between mt-2">
          <Text className="text-xl font-rubik-extrabold text-primary">
            #3,500
          </Text>
          <Image
            source={icons.heart}
            className="w-5 h-5 mr-2"
            tintColor="#191d31"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
