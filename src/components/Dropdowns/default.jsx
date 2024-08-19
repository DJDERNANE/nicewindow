import React from "react";
import { StyleSheet, View } from "react-native";
import { WHITE } from "../../styles/colors";

export const DefaultDropdown = (props) => {
  return(
    <View style={styles.container}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 10,
    top: 50,
    backgroundColor: WHITE,
    width: 200
  }
});