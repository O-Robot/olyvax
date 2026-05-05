import { Card } from "@/components/cards";
import EmptyResult from "@/components/empty-result";
import Filters from "@/components/filters";
import Search from "@/components/search";
import { SkeletonContainer } from "@/components/skeleton";
import icons from "@/constants/icons";
import { getProperties } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Explore() {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const [properties, setProperties] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const {
    data: initialProperties,
    loading: loading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: {
      featured: false,
      filter: params.filter!,
      query: params.query!,
      limit: 20,
      offset: 0,
    },
    skip: true,
  });

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  useEffect(() => {
    if (initialProperties) {
      setProperties(initialProperties);
      setOffset(0);
      setHasMore(initialProperties.length === 20);
    }
  }, [initialProperties]);

  useEffect(() => {
    refetch({
      featured: false,
      filter: params.filter!,
      query: params.query!,
      limit: 20,
      offset: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.filter, params.query]);

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore || loading) return;

    setLoadingMore(true);
    const newOffset = offset + 20;

    try {
      const res = await getProperties({
        featured: false,
        filter: params.filter!,
        query: params.query!,
        limit: 20,
        offset: newOffset,
      });

      if (res) {
        setProperties((prev) => [...prev, ...res]);
        setOffset(newOffset);
        setHasMore(res.length === 20);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="bg-white h-full">
      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <Card onPress={() => handleCardPress(item?.$id)} item={item} />
        )}
        contentContainerClassName="pb-24"
        columnWrapperClassName="flex flex-row gap-5 px-5 justify-between"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.$id}-${index}`}
        numColumns={2}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          loading ? <SkeletonContainer count={6} /> : <EmptyResult />
        }
        ListHeaderComponent={() => (
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <TouchableOpacity
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
                onPress={() => router.back()}
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>
              <Text className="text-base mr-2 text-center font-rubik-medium text-black">
                Explore Your Ideal Home
              </Text>
              <Image source={icons.bell} className="size-6" />
            </View>
            <Search />
            <View className="mt-5">
              <Filters />
              {params.query && (
                <Text className="tetx-xl font-rubik-bold text-black mt-5">
                  Found{" "}
                  <Text className="text-primary">{properties?.length}</Text>{" "}
                  Propert
                  {properties?.length === 1 ? "y" : "ies"}
                </Text>
              )}
            </View>
          </View>
        )}
        ListFooterComponent={
          <View>
            {loadingMore && (
              <ActivityIndicator size="small" className="text-primary mt-5" />
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}
