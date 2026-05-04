import icons from "@/constants/icons";
import images from "@/constants/images";
import { login } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { Redirect } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  const { loading, refetch, isLoggedIn } = useGlobalContext();

  if (!loading && isLoggedIn) return <Redirect href="/" />;

  const handleGoogleLogin = async () => {
    const result = await login();
    if (result) {
      refetch();
    } else {
      Alert.alert("Error", "Failed to login");
    }
  };
  return (
    <SafeAreaView className="bg-white h-full">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={images.onboarding}
          className="w-full h-4/6 mt-5"
          resizeMode="contain"
        />
        <View className="px-10 -mt-8">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome to Olyvax
          </Text>
          <Text className="text-4xl text-center font-bold text-black mt-3">
            Let&apos;s Get You Closer {"\n"} To{" "}
            <Text className="text-primary">Your Ideal Home</Text>
          </Text>
          <Text className="text-lg text-center font-rubik text-black-200 mt-6">
            Login to Olyvax with Google
          </Text>
          <TouchableOpacity
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5 flex flex-row justify-center gap-3 items-center"
            onPress={() => handleGoogleLogin()}
          >
            <Image
              source={icons.google}
              className="w-5 h-5"
              resizeMode="contain"
            />
            <Text className="text-black text-lg font-rubik-medium">
              Continue with Google
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
