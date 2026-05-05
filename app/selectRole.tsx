import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, Pressable,StyleSheet, } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";


export default function SelectRole() {
  const [role, setRole] = useState(null);
  const router = useRouter();
  //router.replace("/user/serviceRequestScreen");
  //router.replace("/(tabs)");

  return (
    <View style={styles.container}>
      <View style={[styles.center]}>
        <Pressable
          onPress={() => {
            setRole("needService");
            router.push({
              pathname: "/register",
              params: { state: "needService" },
            });
          }}
        >
          <View
            style={[
              styles.box,
              styles.box1,
              role == "needService" && styles.selectedBox,
            ]}
          >
            <Text style={styles.font}>I Need Service</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            setRole("provideService");
            router.push({
              pathname: "/(auth)/register",
              params: { state: "provideService" },
            });
          }}
        >
          <View
            style={[
              styles.box,
              styles.box2,
              role == "provideService" && styles.selectedBox,
            ]}
          >
            <Text style={styles.font}>I Provide Service</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: RFValue(50),
  },
  container: {
    flex: 1,
  },

  title: {
    fontWeight: "600",
    fontSize: RFValue(18),
    paddingTop: 60,
    fontFamily: "Inter_600SemiBold",
  },
  box: {
    width: RFValue(220),
    height: RFValue(200),

    borderRadius: RFValue(35),

    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",

    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  box1: {
    backgroundColor: "#ffb84d",
  },
  box2: {
    backgroundColor: "#8bc8ed",
  },
  selectedBox: {
    
    opacity:.8
    
  },
 
  font: {
    fontWeight: "600",
    fontSize: RFValue(18),
    color: "#272626",
  },
});

