import { Card } from "@/components/cards";
import EmptyResult from "@/components/empty-result";
import Filters from "@/components/filters";
import Search from "@/components/search";
import { SkeletonContainer } from "@/components/skeleton";
import icons from "@/constants/icons";
import { getPaginatedProperties } from "@/lib/appwrite";
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

const PAGE_SIZE = 20;
type PageItem = number | "ellipsis";

const getPageItems = (currentPage: number, totalPages: number): PageItem[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, "ellipsis", totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 1) {
    return [1, 2, "ellipsis", totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage, "ellipsis", totalPages];
};

export default function Explore() {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();
  const filter = params.filter ?? "All";
  const query = params.query ?? "";

  const [properties, setProperties] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    data: propertyPage,
    loading: loading,
    refetch,
  } = useAppwrite({
    fn: getPaginatedProperties,
    params: {
      featured: false,
      filter,
      query,
      limit: PAGE_SIZE,
      offset: 0,
    },
    skip: true,
  });

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  useEffect(() => {
    if (propertyPage) {
      setProperties(propertyPage.documents);
      setTotalPages(Math.max(1, Math.ceil(propertyPage.total / PAGE_SIZE)));
    }
  }, [propertyPage]);

  useEffect(() => {
    setProperties([]);
    setPage(1);
    setTotalPages(1);

    refetch({
      featured: false,
      filter,
      query,
      limit: PAGE_SIZE,
      offset: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, query]);

  const handlePageChange = async (nextPage: number) => {
    if (loading || nextPage < 1 || nextPage === page) return;

    if (nextPage > totalPages) return;

    setPage(nextPage);
    setProperties([]);

    await refetch({
      featured: false,
      filter,
      query,
      limit: PAGE_SIZE,
      offset: (nextPage - 1) * PAGE_SIZE,
    });
  };

  const pageItems = getPageItems(page, totalPages);
  const showPagination = properties.length > 0;

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <View className="flex-1 max-w-[48%]">
            <Card onPress={() => handleCardPress(item?.$id)} item={item} />
          </View>
        )}
        contentContainerClassName="pb-54"
        columnWrapperClassName="flex flex-row gap-5 px-5 justify-between"
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.$id}-${index}`}
        numColumns={2}
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
              {query && (
                <Text className="text-xl font-rubik-bold text-black mt-5">
                  Showing{" "}
                  <Text className="text-primary">{properties?.length}</Text>{" "}
                  Propert
                  {properties?.length === 1 ? "y" : "ies"}
                </Text>
              )}
            </View>
          </View>
        )}
        ListFooterComponent={
          showPagination ? (
            <View className="items-center px-5 pb-20 mt-6">
              <View className="flex flex-row items-center justify-center gap-2">
                <TouchableOpacity
                  className={`size-10 rounded-full items-center justify-center ${
                    page === 1 || loading ? "bg-primary-200" : "bg-primary"
                  }`}
                  disabled={page === 1 || loading}
                  onPress={() => handlePageChange(page - 1)}
                >
                  <Image
                    source={icons.rightArrow}
                    className="size-4 rotate-180"
                    tintColor={page === 1 || loading ? "#8C8E98" : "#FFFFFF"}
                  />
                </TouchableOpacity>

                {pageItems.map((item, index) =>
                  item === "ellipsis" ? (
                    <Text
                      key={`ellipsis-${index}`}
                      className="w-8 text-center text-base font-rubik-medium text-black-200"
                    >
                      ...
                    </Text>
                  ) : (
                    <TouchableOpacity
                      key={item}
                      className={`size-10 rounded-full items-center justify-center ${
                        item === page ? "bg-primary" : "bg-primary-200"
                      }`}
                      disabled={loading || item === page}
                      onPress={() => handlePageChange(item)}
                    >
                      <Text
                        className={`font-rubik-bold ${
                          item === page ? "text-white" : "text-black"
                        }`}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}

                <TouchableOpacity
                  className={`size-10 rounded-full items-center justify-center ${
                    page === totalPages || loading
                      ? "bg-primary-200"
                      : "bg-primary"
                  }`}
                  disabled={page === totalPages || loading}
                  onPress={() => handlePageChange(page + 1)}
                >
                  <Image
                    source={icons.rightArrow}
                    className="size-4"
                    tintColor={
                      page === totalPages || loading ? "#8C8E98" : "#FFFFFF"
                    }
                  />
                </TouchableOpacity>
              </View>

              <View className="flex flex-row items-center gap-2 mt-3">
                {loading && <ActivityIndicator size="small" />}
                <Text className="font-rubik-medium text-black-200">
                  Page {page} of {totalPages}
                </Text>
              </View>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
