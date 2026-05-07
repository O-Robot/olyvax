import { categories } from "@/constants/data";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

const Filters = () => {
  const params = useLocalSearchParams<{ filter?: string }>();

  const [selectedCategory, setSelectedCategory] = useState(
    params.filter || "All",
  );

  useEffect(() => {
    setSelectedCategory(params.filter || "All");
  }, [params.filter]);

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory("All");
      router.setParams({ filter: "All" });
      return;
    }

    setSelectedCategory(category);
    router.setParams({ filter: category });
  };
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-1"
    >
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleCategorySelect(category.category)}
          className={`flex flex-col items-start mr-4 px-4 py-2  rounded-full ${selectedCategory === category.category ? "bg-primary " : "bg-primary-100 border border-primary-200"}`}
        >
          <Text
            className={`text-sm ${selectedCategory === category.category ? "text-white font-rubik-bold mt-0.5" : "text-black font-rubik"}`}
          >
            {category.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Filters;
