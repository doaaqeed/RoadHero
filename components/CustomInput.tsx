import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  isTouched,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}) => {
  return (
    <View style={{ marginBottom: 30 }}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor="#706e6e"
        style={[
          styles.input,
          {
            borderColor: error ? "red" : isTouched ? "green" : "#ccc",
          },
        ]}
      />
      {error && <Text style={styles.ERROR_MESSAGES}>{error.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: RFValue(20),
    borderRadius: RFValue(18),
    fontSize: RFValue(12),
    width: RFValue(300),
  },
  ERROR_MESSAGES: {
    color: "rgba(242, 5, 5, 0.79)",
    paddingTop: 5,
    paddingLeft: 20,
    fontSize: RFValue(11),
  },
});

export default CustomInput;