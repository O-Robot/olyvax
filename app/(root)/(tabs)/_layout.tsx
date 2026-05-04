import icons from "@/constants/icons";
import { Tabs } from "expo-router";
import React from "react";
import { Image, StatusBar, Text, View } from "react-native";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: any;
  title: string;
}) => (
  <View className="flex-1 mt-3 flex flex-col items-center">
    <Image
      source={icon}
      tintColor={focused ? "#FF6B00" : "#5F5852"}
      className="size-7"
      resizeMode="contain"
    />
    <Text
      className={`${focused ? "text-primary font-rubik-medium" : "text-black-200 font-rubik "} text-xs w-full text-center mt-1`}
    >
      {title}
    </Text>
  </View>
);

const TabsLayout = () => {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "white",
            position: "absolute",
            borderTopColor: "#FFF1E6",
            borderTopWidth: 1,
            minHeight: 70,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View>
                <TabIcon icon={icons.home} focused={focused} title="Home" />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View>
                <TabIcon
                  icon={icons.search}
                  focused={focused}
                  title="Explore"
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View>
                <TabIcon
                  icon={icons.person}
                  focused={focused}
                  title="Profile"
                />
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
