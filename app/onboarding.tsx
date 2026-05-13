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
  const isLastPage = currentIndex === onboarding_data.length - 1;

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem("hasLaunched", "true");
      router.replace("/selectRole");
    } catch (e) {
      console.error("Storage Error:", e);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboarding_data}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View>
            <View style={{ width, height: height * 0.7 }}>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <View style={styles.dotsRow}>
              {onboarding_data.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === currentIndex && styles.activeDot]}
                />
              ))}
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.baseBtn,
                  isLastPage ? styles.getStartedBtn : styles.nextBtn,
                ]}
                onPress={isLastPage ? handleFinish : handleNext}
              >
                <Text style={styles.btnText}>
                  {isLastPage ? "GET STARTED" : "NEXT"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  image: { width: width, height: height },
  footer: { alignItems: "center", justifyContent: "center", marginTop: 10 },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    marginTop: 140,
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: "#DDD",
    marginHorizontal: 4,
  },
  activeDot: { backgroundColor: "#FF8C00", width: 20 },
  baseBtn: { paddingVertical: 15, borderRadius: 12, alignItems: "center" },
  nextBtn: { backgroundColor: "#FF8C00", paddingHorizontal: 80 },
  getStartedBtn: { backgroundColor: "#FF8C00", width: "80%" },
  btnText: { color: "#FFF", fontSize: 18, fontWeight: "800" },
});
