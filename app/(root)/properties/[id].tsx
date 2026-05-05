import Comment from "@/components/comment";
import { facilities } from "@/constants/data";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { getPropertyById } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Property = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: property } = useAppwrite({
    fn: getPropertyById,
    params: {
      id: id!,
    },
  });

  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;

  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<
    number | null
  >(null);
  const flatListRef = useRef<FlatList>(null);
  const reviewsFlatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / windowWidth);
    setCurrentGalleryIndex(index);
  };
  const handleReviewScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / windowWidth);
    setCurrentReviewIndex(index);
  };

  useEffect(() => {
    if (!property?.reviews || property.reviews.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => {
        const nextIndex =
          prevIndex >= property.reviews.length - 1 ? 0 : prevIndex + 1;

        reviewsFlatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });

        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(intervalId);
  }, [property?.reviews]);

  return (
    <View>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white"
      >
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          {property?.gallery && property.gallery.length > 0 ? (
            <View className="size-full">
              <FlatList
                ref={flatListRef}
                data={property.gallery}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                keyExtractor={(item, index) =>
                  typeof item === "string"
                    ? item
                    : item?.$id || index.toString()
                }
                renderItem={({ item }) => {
                  const imageUrl =
                    typeof item === "string"
                      ? property?.image
                      : item?.image || property?.image;
                  return (
                    <Image
                      source={{ uri: imageUrl }}
                      resizeMode="cover"
                      style={{ width: windowWidth, height: windowHeight / 2 }}
                    />
                  );
                }}
              />
              {/* Carousel Navigation Dots */}
              <View className="absolute bottom-10 w-full flex flex-row justify-center gap-2 z-50">
                {property.gallery.map((_: string, index: number) => (
                  <View
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentGalleryIndex === index
                        ? "w-6 bg-primary"
                        : "w-2 bg-white/70"
                    }`}
                  />
                ))}
              </View>
            </View>
          ) : (
            <Image
              source={{ uri: property?.image }}
              resizeMode="cover"
              className="size-full"
            />
          )}
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
          />
          <View
            className="z-50 absolute inset-x-7"
            style={{
              top: Platform.OS === "ios" ? 60 : 20,
            }}
          >
            <View className="flex flex-row items-center w-full justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              <View className="flex flex-row items-center gap-3">
                <Image
                  source={icons.heart}
                  className="size-7"
                  tintColor={"#191D31"}
                />
                <Image source={icons.send} className="size-7" />
              </View>
            </View>
          </View>
        </View>

        {/* property details  */}
        <View className="px-5 mt-7 flex gap-2">
          <Text className="text-2xl font-rubik-extrabold">
            {property?.name}
          </Text>

          <View className="flex flex-row items-center gap-3">
            <View className="flex flex-row items-center px-4 py-2 bg-primary-100 rounded-full">
              <Text className="text-xs font-rubik-bold text-primary">
                {property?.type}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2">
              <Image source={icons.star} className="size-5" />
              <Text className="text-black-200 text-sm font-rubik-medium">
                {property?.rating != null
                  ? Number(property?.rating).toFixed(1)
                  : null}
                {property?.reviews?.length &&
                  ` (${property?.reviews?.length} reviews)`}
              </Text>
            </View>
          </View>
          {/* proerty bed, bath and area  */}
          <View className="flex flex-row items-center mt-5">
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10">
              <Image source={icons.bed} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              {property?.bedrooms} Beds
            </Text>
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10 ml-7">
              <Image source={icons.bath} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              {property?.bathrooms} Baths
            </Text>
            <View className="flex flex-row items-center justify-center bg-primary-100 rounded-full size-10 ml-7">
              <Image source={icons.area} className="size-4" />
            </View>
            <Text className="text-black-300 text-sm font-rubik-medium ml-2">
              {property?.area} sqft
            </Text>
          </View>

          {/* agent */}
          <View className="w-full border-t border-primary-200 pt-7 mt-5">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Agent
            </Text>

            <View className="flex flex-row items-center justify-between mt-4">
              <View className="flex flex-row items-center">
                <Image
                  source={{ uri: property?.agent?.avatar }}
                  className="size-14 rounded-full"
                />

                <View className="flex flex-col items-start justify-center ml-3">
                  <Text className="text-lg text-black-300 text-start font-rubik-bold">
                    {property?.agent?.name}
                  </Text>
                  <Text className="text-sm text-black-200 text-start font-rubik-medium">
                    {property?.agent?.email}
                  </Text>
                </View>
              </View>

              <View className="flex flex-row items-center gap-3">
                <Image source={icons.chat} className="size-7" />
                <Image source={icons.phone} className="size-7" />
              </View>
            </View>
          </View>

          {/* overview */}
          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Overview
            </Text>
            <Text
              numberOfLines={isExpanded ? undefined : 3}
              className="text-black-200 text-base font-rubik mt-2"
            >
              {property?.description}
            </Text>
            {property?.description && (
              <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                <Text className="text-primary text-sm font-rubik-bold mt-2">
                  {isExpanded ? "Show Less" : "Read More"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* facilities */}
          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Facilities
            </Text>

            {property?.facilities.length > 0 && (
              <View className="flex flex-row flex-wrap items-start justify-start mt-2 gap-5">
                {property?.facilities?.map((item: string, index: number) => {
                  const facility = facilities.find(
                    (facility) => facility.label === item,
                  );

                  return (
                    <View
                      key={index}
                      className="flex flex-1 flex-col items-center min-w-16 max-w-20"
                    >
                      <View className="size-14 bg-primary-100 rounded-full flex items-center justify-center">
                        <Image
                          source={facility ? facility.icon : icons.info}
                          className="size-6"
                        />
                      </View>

                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className="text-black-300 text-sm text-center font-rubik mt-1.5"
                      >
                        {item}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* gallery */}
          {property?.gallery?.length > 0 && (
            <View className="mt-7">
              <Text className="text-black-300 text-xl font-rubik-bold">
                Gallery
              </Text>
              <FlatList
                contentContainerStyle={{ paddingRight: 20 }}
                data={property?.gallery}
                keyExtractor={(item) => item.$id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedGalleryIndex(index)}
                  >
                    <Image
                      source={{ uri: item.image }}
                      className="size-40 rounded-xl"
                    />
                  </TouchableOpacity>
                )}
                contentContainerClassName="flex gap-4 mt-3"
              />
            </View>
          )}

          {/* location */}
          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Location
            </Text>
            <View className="flex flex-row items-center justify-start  py-2 gap-2">
              <Image source={icons.location} className="size-4 " />
              <Text className="text-black-200 text-sm font-rubik-medium">
                {property?.address}
              </Text>
            </View>

            <Image
              source={images.map}
              className="h-52 w-full mt-5 rounded-xl"
            />
          </View>

          {/* reviews */}
          {property?.reviews?.length > 0 && (
            <View className="mt-7">
              <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center">
                  <Image source={icons.star} className="size-6" />
                  <Text className="text-black-300 text-xl font-rubik-bold ml-2">
                    {property?.rating != null
                      ? Number(property?.rating).toFixed(1)
                      : null}{" "}
                    ({property?.reviews.length} review
                    {property?.reviews.length === 1 ? "" : "s"})
                  </Text>
                </View>
              </View>

              <View className="w-full mt-5">
                <FlatList
                  ref={reviewsFlatListRef}
                  data={property?.reviews}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleReviewScroll}
                  scrollEventThrottle={16}
                  getItemLayout={(_, index) => ({
                    length: windowWidth - 40,
                    offset: (windowWidth - 40) * index,
                    index,
                  })}
                  keyExtractor={(item, index) =>
                    typeof item === "string"
                      ? item
                      : item?.$id || index.toString()
                  }
                  renderItem={({ item }) => {
                    return (
                      <View style={{ width: windowWidth - 40 }}>
                        <Comment item={item} />
                      </View>
                    );
                  }}
                />
                {/* Carousel Navigation Dots */}
                <View className="flex flex-row justify-center gap-2 mt-5">
                  {property?.reviews.map((_: any, index: number) => (
                    <View
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentReviewIndex === index
                          ? "w-6 bg-primary"
                          : "w-2 bg-primary-200"
                      }`}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {/* button and price */}
      <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-r border-l border-primary-200 p-7">
        <View className="flex flex-row items-center justify-between gap-10">
          <View className="flex flex-col items-start">
            <Text className="text-black-200 text-xs font-rubik-medium">
              Price
            </Text>
            <Text
              numberOfLines={1}
              className="text-primary text-start text-2xl font-rubik-bold"
            >
              ₦{property?.price.toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity className="flex-1 flex flex-row items-center justify-center bg-primary py-4 rounded-full shadow-md shadow-zinc-400 max-w-[60%]">
            <Text className="text-white text-lg text-center font-rubik-bold">
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Full Screen Image Modal */}
      <Modal
        visible={selectedGalleryIndex !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedGalleryIndex(null)}
      >
        <View className="flex-1 bg-black justify-center items-center">
          <TouchableOpacity
            onPress={() => setSelectedGalleryIndex(null)}
            className="absolute top-14 right-6 z-50 bg-white/20 rounded-full size-10 items-center justify-center"
          >
            <Text className="text-white text-lg font-rubik-bold">X</Text>
          </TouchableOpacity>
          <FlatList
            data={property?.gallery}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedGalleryIndex ?? 0}
            getItemLayout={(_, index) => ({
              length: windowWidth,
              offset: windowWidth * index,
              index,
            })}
            keyExtractor={(item, index) =>
              typeof item === "string" ? item : item?.$id || index.toString()
            }
            renderItem={({ item }) => {
              const imageUrl =
                typeof item === "string"
                  ? property?.image
                  : item?.image || property?.image;
              return (
                <Image
                  source={{ uri: imageUrl }}
                  resizeMode="contain"
                  style={{ width: windowWidth, height: windowHeight }}
                />
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Property;
