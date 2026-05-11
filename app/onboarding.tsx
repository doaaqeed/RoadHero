import onboarding_data from "@/constants/onboarding_data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem("hasLaunched", "true");
      router.replace("/selectRole");
    } catch (e) {
      console.log("Storage Error:", e);
    }
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={onboarding_data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width, height: height * 0.7 }}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      />
      <View style={styles.dotsRow}>
        {onboarding_data.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentIndex && styles.activeDot]}
          />
        ))}
      </View>
      <View style={styles.footer}>
        {currentIndex === 2 ? (
          <TouchableOpacity style={styles.getStartedBtn} onPress={handleFinish}>
            <Text style={styles.btnText}>GET STARTED</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() =>
              flatListRef.current?.scrollToIndex({ index: currentIndex + 1 })
            }
          >
            <Text style={styles.btnText}>NEXT</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 60,
    alignItems: "flex-end",
    paddingHorizontal: 25,
  },
  image: {
    width: width,
    height: height,
  },
  footer: { height: 180, alignItems: "center", justifyContent: "center" },
  btnText: { color: "#FFF", fontSize: 18, fontWeight: "800" },
  dotsRow: { justifyContent: "center", flexDirection: "row", marginTop: 40 },

  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: "#DDD",
    marginHorizontal: 4,
  },
  activeDot: { backgroundColor: "#FF8C00", width: 18 },
  nextBtn: {
    backgroundColor: "#FF8C00",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 12,
  },
  getStartedBtn: {
    backgroundColor: "#FF8C00",
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
});
