import React from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import { PRIMARY } from "../../styles/colors";

export const FullscreenLoading = () => {
  return(
    <View style={styles.container}>
      <ActivityIndicator size={50} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    zIndex: 10,
    backgroundColor: PRIMARY,
    justifyContent: 'center'
  }
});