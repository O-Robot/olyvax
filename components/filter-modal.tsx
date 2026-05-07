import { categories } from "@/constants/data";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { getPropertyFilterBounds } from "@/lib/appwrite";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FilterBounds = {
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
};

type RangeSliderProps = {
  min: number;
  max: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
  showChart?: boolean;
};

const formatCurrency = (value: number) =>
  `₦${Math.round(value).toLocaleString()}`;
const formatNumber = (value: number) => Math.round(value).toLocaleString();

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const getParamNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;

  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? fallback : numberValue;
};

const getClampedRange = (
  minParam: string | undefined,
  maxParam: string | undefined,
  minBound: number,
  maxBound: number,
): [number, number] => {
  const minValue = clamp(
    getParamNumber(minParam, minBound),
    minBound,
    maxBound,
  );
  const maxValue = clamp(
    getParamNumber(maxParam, maxBound),
    minBound,
    maxBound,
  );

  return minValue <= maxValue ? [minValue, maxValue] : [minBound, maxBound];
};

const RangeSlider = ({
  min,
  max,
  values,
  onChange,
  showChart,
}: RangeSliderProps) => {
  const [width, setWidth] = useState(0);
  const startMinPosition = useRef(0);
  const startMaxPosition = useRef(0);
  const safeMax = max > min ? max : min + 1;

  const valueToPosition = (value: number) => {
    if (!width) return 0;
    return ((value - min) / (safeMax - min)) * width;
  };

  const positionToValue = (position: number) => {
    const ratio = clamp(position, 0, width) / Math.max(width, 1);
    return Math.round(min + ratio * (safeMax - min));
  };

  const updateMin = (position: number) => {
    const nextMin = Math.min(positionToValue(position), values[1]);
    onChange([nextMin, values[1]]);
  };

  const updateMax = (position: number) => {
    const nextMax = Math.max(positionToValue(position), values[0]);
    onChange([values[0], nextMax]);
  };

  const minPosition = valueToPosition(values[0]);
  const maxPosition = valueToPosition(values[1]);

  const minPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          startMinPosition.current = minPosition;
        },
        onPanResponderMove: (event, gestureState) =>
          updateMin(startMinPosition.current + gestureState.dx),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minPosition, values, width, min, max],
  );

  const maxPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          startMaxPosition.current = maxPosition;
        },
        onPanResponderMove: (event, gestureState) =>
          updateMax(startMaxPosition.current + gestureState.dx),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxPosition, values, width, min, max],
  );

  return (
    <View className="mt-4">
      <View
        className={`${showChart ? "h-20" : "h-2"} justify-end `}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width - 10)}
      >
        {showChart && (
          <Image
            source={images.barChart}
            className="absolute bottom-0 w-full h-20"
            resizeMode="stretch"
          />
        )}
        <View className="h-1.5 rounded-full bg-primary-100" />
        <View
          className=" left-3 bottom-0 h-1.5 rounded-full bg-primary"
          style={{
            left: minPosition,
            width: Math.max(maxPosition - minPosition, 0),
          }}
        />
        <View
          className="absolute -bottom-3 size-8 rounded-full border-4 border-primary bg-white"
          // style={{ left: minPosition - 16 }}
          {...minPanResponder.panHandlers}
        />
        <View
          className="absolute -bottom-3 size-8 rounded-full border-4 border-primary bg-white"
          style={{ left: maxPosition - 20 }}
          {...maxPanResponder.panHandlers}
        />
      </View>
    </View>
  );
};

const Counter = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) => {
  return (
    <View className="flex flex-row items-center justify-between py-4 border-b border-primary-100">
      <Text className="text-base font-rubik-bold text-black-200">{label}</Text>
      <View className="flex flex-row items-center gap-6">
        <TouchableOpacity
          className="size-9 rounded-full bg-primary-100 items-center justify-center"
          onPress={() => onChange(Math.max(0, value - 1))}
        >
          <Text className="text-2xl leading-6 font-rubik-bold text-primary">
            -
          </Text>
        </TouchableOpacity>
        <Text className="w-5 text-center text-lg font-rubik-bold text-black">
          {value}
        </Text>
        <TouchableOpacity
          className="size-9 rounded-full bg-primary-100 items-center justify-center"
          onPress={() => onChange(value + 1)}
        >
          <Text className="text-2xl leading-6 font-rubik-bold text-primary">
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function FilterModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const params = useLocalSearchParams<{
    filter?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    bathrooms?: string;
    minArea?: string;
    maxArea?: string;
  }>();
  const [bounds, setBounds] = useState<FilterBounds>({
    minPrice: 0,
    maxPrice: 0,
    minArea: 0,
    maxArea: 0,
  });
  const [loadingBounds, setLoadingBounds] = useState(false);
  const [selectedType, setSelectedType] = useState(params.filter ?? "All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 0]);
  const [bedrooms, setBedrooms] = useState(Number(params.bedrooms ?? 0));
  const [bathrooms, setBathrooms] = useState(Number(params.bathrooms ?? 0));
  const sheetTranslateY = useRef(new Animated.Value(600)).current;
  const loadedBoundsRef = useRef(false);

  const typeOptions = categories.filter(({ category }) => category !== "All");

  useEffect(() => {
    if (!visible) return;

    sheetTranslateY.setValue(600);
    Animated.timing(sheetTranslateY, {
      toValue: 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [sheetTranslateY, visible]);

  useEffect(() => {
    if (!visible) return;

    const loadBounds = async () => {
      setLoadingBounds(true);
      const result = await getPropertyFilterBounds();
      setBounds(result);
      setPriceRange(
        getClampedRange(
          params.minPrice,
          params.maxPrice,
          result.minPrice,
          result.maxPrice,
        ),
      );
      setAreaRange(
        getClampedRange(
          params.minArea,
          params.maxArea,
          result.minArea,
          result.maxArea,
        ),
      );
      loadedBoundsRef.current = true;
      setLoadingBounds(false);
    };

    if (loadedBoundsRef.current) return;

    loadBounds();
  }, [
    params.maxArea,
    params.maxPrice,
    params.minArea,
    params.minPrice,
    visible,
  ]);

  useEffect(() => {
    if (!visible || !loadedBoundsRef.current) return;

    setPriceRange(
      getClampedRange(
        params.minPrice,
        params.maxPrice,
        bounds.minPrice,
        bounds.maxPrice,
      ),
    );
    setAreaRange(
      getClampedRange(
        params.minArea,
        params.maxArea,
        bounds.minArea,
        bounds.maxArea,
      ),
    );
    setSelectedType(params.filter ?? "All");
    setBedrooms(Number(params.bedrooms ?? 0));
    setBathrooms(Number(params.bathrooms ?? 0));
  }, [
    bounds.maxArea,
    bounds.maxPrice,
    bounds.minArea,
    bounds.minPrice,
    params.bathrooms,
    params.bedrooms,
    params.filter,
    params.maxArea,
    params.maxPrice,
    params.minArea,
    params.minPrice,
    visible,
  ]);

  const handleReset = () => {
    setSelectedType("All");
    setPriceRange([bounds.minPrice, bounds.maxPrice]);
    setAreaRange([bounds.minArea, bounds.maxArea]);
    setBedrooms(0);
    setBathrooms(0);
    router.setParams({
      filter: "All",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      minArea: "",
      maxArea: "",
    });
  };

  const handleApply = () => {
    router.setParams({
      filter: selectedType,
      minPrice: priceRange[0] > bounds.minPrice ? String(priceRange[0]) : "",
      maxPrice: priceRange[1] < bounds.maxPrice ? String(priceRange[1]) : "",
      bedrooms: bedrooms > 0 ? String(bedrooms) : "",
      bathrooms: bathrooms > 0 ? String(bathrooms) : "",
      minArea: areaRange[0] > bounds.minArea ? String(areaRange[0]) : "",
      maxArea: areaRange[1] < bounds.maxArea ? String(areaRange[1]) : "",
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/45">
        <Pressable className="absolute inset-0" onPress={onClose} />
        <Animated.View
          className="max-h-[92%] rounded-t-[36px] bg-white px-6 pt-6 pb-10"
          style={{ transform: [{ translateY: sheetTranslateY }] }}
        >
          {/* header  */}
          <View className="flex flex-row items-center justify-between mb-6">
            <TouchableOpacity
              className="size-12 rounded-full bg-primary-100 items-center justify-center"
              onPress={onClose}
            >
              <Image source={icons.backArrow} className="size-5" />
            </TouchableOpacity>
            <Text className="text-lg font-rubik-bold text-black">Filter</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text className="text-lg font-rubik-bold text-primary">
                Reset
              </Text>
            </TouchableOpacity>
          </View>

          {loadingBounds ? (
            <View className="h-96 items-center justify-center">
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-xl font-rubik-bold text-black">
                Price Range
              </Text>
              <RangeSlider
                min={bounds.minPrice}
                max={bounds.maxPrice}
                values={priceRange}
                onChange={setPriceRange}
                showChart
              />
              <View className="flex flex-row justify-between mt-4">
                <Text className="text-lg font-rubik-bold text-primary">
                  {formatCurrency(priceRange[0])}
                </Text>
                <Text className="text-lg font-rubik-bold text-primary">
                  {formatCurrency(priceRange[1])}
                </Text>
              </View>

              <Text className="text-2xl font-rubik-bold text-black mt-10">
                Property Type
              </Text>
              <View className="flex flex-row flex-wrap gap-3 mt-5">
                {typeOptions.map(({ title, category }) => (
                  <TouchableOpacity
                    key={category}
                    className={`flex flex-col items-start px-4 py-2 rounded-full border ${
                      selectedType === category
                        ? "bg-primary border-primary"
                        : "bg-white border-primary-200"
                    }`}
                    onPress={() =>
                      setSelectedType(
                        selectedType === category ? "All" : category,
                      )
                    }
                  >
                    <Text
                      className={`text-sm ${
                        selectedType === category
                          ? "text-white font-rubik-bold"
                          : "text-black font-rubik"
                      }`}
                    >
                      {title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-xl font-rubik-bold text-black mt-5">
                Home Details
              </Text>
              <Counter
                label="Bedrooms"
                value={bedrooms}
                onChange={setBedrooms}
              />
              <Counter
                label="Bathrooms"
                value={bathrooms}
                onChange={setBathrooms}
              />

              {/* <Text className="text-xl font-rubik-bold text-black mt-5">
                Building Size
              </Text>
              <RangeSlider
                min={bounds.minArea}
                max={bounds.maxArea}
                values={areaRange}
                onChange={setAreaRange}
              />
              <View className="flex flex-row justify-between mt-4">
                <Text className="text-lg font-rubik-bold text-primary">
                  {formatNumber(areaRange[0])}
                </Text>
                <Text className="text-lg font-rubik-bold text-primary">
                  {formatNumber(areaRange[1])}
                </Text>
              </View> */}

              <TouchableOpacity
                className="h-16 rounded-full bg-primary items-center justify-center mt-10 mb-4"
                onPress={handleApply}
              >
                <Text className="text-xl font-rubik-bold text-white">
                  Set Filter
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
