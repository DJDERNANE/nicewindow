import React from "react";
import { TextInput, StyleSheet, View } from "react-native";
import { BLACK, GRAY, LIGHT, WHITE } from "../../styles/colors";
import { useFonts, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import PropTypes from "prop-types";

export const DefaultInput = (props) => {
  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <TextInput
      style={[styles.input, props.style, { fontFamily: "Montserrat_700Bold" }]}
      placeholder={props.placeholder}
      placeholderTextColor={GRAY}
      keyboardType={props.keyboardType}
      secureTextEntry={props.secureTextEntry}
      onChangeText={props.onChangeText}
      value={props.value}
      onFocus={props.onFocus}
      maxLength={props.maxLength}
      editable={props.editable}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: WHITE,
    padding: 16,
    fontSize: 18,
    color: BLACK,
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    textAlign: "left",
  },
});

DefaultInput.propTypes = {
  style: PropTypes.object,
  placeholder: PropTypes.string,
  keyboardType: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  onFocus: PropTypes.func,
  maxLength: PropTypes.number,
  editable: PropTypes.bool,
};
