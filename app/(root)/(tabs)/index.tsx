import { Card } from "@/components/cards";
import EmptyResult from "@/components/empty-result";
import Filters from "@/components/filters";
import { CardSkeleton, SkeletonContainer } from "@/components/skeleton";
import { getGreeting } from "@/constants";
import icons from "@/constants/icons";
import { getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useGlobalContext();
  const greeting = getGreeting();

  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const { data: featuredData, loading: featuredLoading } = useAppwrite({
    fn: getProperties,
    params: {
      featured: true,
      filter: params.filter!,
      query: params.query!,
      limit: 6,
    },
  });
  const {
    data: properties,
    loading: loading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: {
      featured: false,
      filter: params.filter!,
      query: params.query!,
      limit: 10,
    },
    skip: true,
  });

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  useEffect(() => {
    refetch({
      featured: false,
      filter: params.filter!,
      query: params.query!,
      limit: 10,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.filter, params.query]);
  return (
    <SafeAreaView edges={["top"]} className="bg-white h-full">
      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <View className="flex-1 max-w-[48%]">
            <Card onPress={() => handleCardPress(item?.$id)} item={item} />
          </View>
        )}
        contentContainerClassName="pb-24"
        columnWrapperClassName="flex flex-row gap-5 px-5 justify-between"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.$id}-${index}`}
        numColumns={2}
        ListEmptyComponent={
          loading ? <SkeletonContainer count={6} /> : <EmptyResult />
        }
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
            {/* <Search /> */}
            <View className="my-5">
              {featuredLoading ? (
                <>
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
                    renderItem={() => (
                      <View className="w-60">
                        <CardSkeleton />
                      </View>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="flex gap-5 mt-5"
                    keyExtractor={(item) => item.toString()}
                    bounces={false}
                  />
                </>
              ) : !featuredData || featuredData.length === 0 ? (
                <></>
              ) : (
                <>
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
                    data={featuredData}
                    renderItem={({ item }) => (
                      <Card
                        onPress={() => handleCardPress(item?.$id)}
                        item={item}
                        featured
                      />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="flex gap-5 mt-5"
                    keyExtractor={(item, index) => `${item.$id}-${index}`}
                    bounces={false}
                  />
                </>
              )}

              <View className="flex flex-row items-center justify-between my-5">
                <Text className="text-xl font-rubik-bold text-black">
                  {params.query ? "Search Result" : "Our Recommendation"}
                </Text>
                <TouchableOpacity onPress={() => router.push("/explore")}>
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
