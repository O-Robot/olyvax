import FilterModal from "@/components/filter-modal";
import icons from "@/constants/icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";
import { useDebouncedCallback } from "use-debounce";

const Search = () => {
  const params = useLocalSearchParams<{
    query?: string;
    filter?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    bathrooms?: string;
    minArea?: string;
    maxArea?: string;
  }>();

  const [search, setSearch] = useState(params.query);
  const [filterVisible, setFilterVisible] = useState(false);
  const hasActiveFilter =
    (params.filter && params.filter !== "All") ||
    Boolean(
      params.minPrice ||
        params.maxPrice ||
        params.bedrooms ||
        params.bathrooms ||
        params.minArea ||
        params.maxArea,
    );

  const debouncedsearch = useDebouncedCallback(
    (text: string) => router.setParams({ query: text }),
    500,
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedsearch(text);
  };
  return (
    <View className="flex flex-row items-center justify-between px-4 rounded-lg border border-primary-200 mt-5 py-2 w-full">
      <View className="flex-1 flex flex-row items-center justify-start z-50">
        <Image source={icons.search} className="size-5" />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search for anything"
          className="text-sm font-rubik h-full text-black ml-2 flex-1"
        />
      </View>
      {params.query && (
        <TouchableOpacity
          onPress={() => {
            setSearch("");
            handleSearch("");
          }}
        >
          <Image source={icons.cancel} className="size-5 mr-2" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        className={`relative size-9 rounded-full items-center justify-center ${
          hasActiveFilter ? "bg-primary-100" : ""
        }`}
        onPress={() => setFilterVisible(true)}
      >
        <Image
          source={icons.filter}
          className="size-5"
          tintColor={hasActiveFilter ? "#FF6B00" : undefined}
        />
        {hasActiveFilter && (
          <View className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-primary" />
        )}
      </TouchableOpacity>
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
      />
    </View>
  );
};

export default Search;
