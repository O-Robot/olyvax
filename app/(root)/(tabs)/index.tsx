import { Card } from "@/components/cards";
import Filters from "@/components/filters";
import Search from "@/components/search";
import { getGreeting } from "@/constants";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/global-provider";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useGlobalContext();
  const greeting = getGreeting();
  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={() => <Card />}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.toString()}
        numColumns={2}
        ListHeaderComponent={() => (
          <View className="px-5">
            <View className="flex flex-row justify-between items-center mt-5">
              <View className="flex flex-row items-center gap-2">
                <Image
                  source={{ uri: user?.avatar }}
                  className="size-12 rounded-full"
                />
                <View className="flex flex-col items-start justify-center">
                  <Text className="text-xs text-black-100 font-rubik">
                    {greeting}
                  </Text>
                  <Text className="text-base text-black font-rubik-medium">
                    {user?.name}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6" />
            </View>
            <Search />
            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black">
                  Featured
                </Text>
                <TouchableOpacity>
                  <Text className="text-lg font-rubik-bold text-primary">
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={[1, 2, 3]}
                renderItem={() => <Card featured />}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="flex gap-5 mt-5"
                keyExtractor={(item) => item.toString()}
                bounces={false}
              />

              <View className="flex flex-row items-center justify-between my-5">
                <Text className="text-xl font-rubik-bold text-black">
                  Our Recommendation
                </Text>
                <TouchableOpacity>
                  <Text className="text-lg font-rubik-bold text-primary">
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              <Filters />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
