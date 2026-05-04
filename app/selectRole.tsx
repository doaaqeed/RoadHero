import { View, Text, Pressable,StyleSheet, } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";


export default function SelectRole() {
  return (
    <View>
      <View style={styles.center}>
        <Text style={[styles.title]}>Choose your role</Text>
      </View>

      <View style={styles.center}>
        <Pressable>
          <Text>I Need Service</Text>
        </Pressable>

        <Pressable>
          <Text>I Provide Service</Text>
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
  },
  title: {

    

    fontWeight: "600",
    fontSize: RFValue(18),
    paddingTop: 60,
    fontFamily: "Inter_600SemiBold",
  },
});

