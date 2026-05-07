import { settings } from "@/constants/data";
import icons from "@/constants/icons";
import { logout } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import React from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingItemProps {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow,
}: SettingItemProps) => (
  <TouchableOpacity
    className="flex flex-row justify-between items-center py-3"
    onPress={onPress ? () => onPress() : () => {}}
  >
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="size-6" />
      <Text className={`text-lg font-rubik-medium text-black ${textStyle}`}>
        {title}
      </Text>
    </View>
    {showArrow && <Image source={icons.rightArrow} className="size-5" />}
  </TouchableOpacity>
);
const Profile = () => {
  const { user, refetch } = useGlobalContext();

  const confirmLogout = async () => {
    const result = await logout();

    if (result) {
      Alert.alert("Success", "You have sucessfully logged out");
      refetch();
    } else {
      Alert.alert("Error", "An error occured while logging out. Try Again!");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: confirmLogout,
      },
    ]);
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row justify-between items-center mt-5">
          <Text className="font-rubik-bold text-xl">Profile</Text>
          <Image source={icons.bell} className="size-5" />
        </View>
        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col  items-center relative mt-5">
            <Image
              source={{ uri: user?.avatar }}
              className="size-44 relative rounded-full object-top"
              resizeMode="cover"
            />
            <TouchableOpacity className="absolute -bottom-2 right-2">
              <Image source={icons.edit} className="size-11" />
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-2xl font-rubik-bold mt-5 px-4 text-center">
          {user?.name}
        </Text>
        <View className="flex flex-col mt-5">
          <SettingItem icon={icons.calendar} title="My Bookings" showArrow />
          <SettingItem icon={icons.wallet} title="Payments" showArrow />
        </View>
        <View className="flex flex-col mt-5 border-t border-primary-200 pt-5">
          {settings.slice(2).map((setting, _) => (
            <SettingItem
              key={_}
              icon={setting.icon}
              title={setting.title}
              showArrow
            />
          ))}
        </View>
        <View className="flex flex-col mt-5">
          <SettingItem
            icon={icons.logout}
            title="Logout"
            showArrow={false}
            textStyle="text-red-500"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
