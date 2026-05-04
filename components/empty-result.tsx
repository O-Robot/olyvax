import images from "@/constants/images";
import React from "react";
import { Image, Text, View } from "react-native";

const EmptyResult = () => {
  return (
    <View className="flex items-center my-5">
      <Image
        source={images.noResult}
        className="w-11/12 h-80"
        resizeMode="contain"
      />
      <Text className="text-2xl font-rubik-bold text-black">No Result</Text>
      <Text className="text-base font-rubik text-black-100 ">
        We could not find any result
      </Text>
    </View>
  );
};

export default EmptyResult;
