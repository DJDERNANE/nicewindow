import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Button, Image, View } from "react-native";

export const ProfilePicturePicker = (props) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity style={styles.container} onPress={props.pickImage}>
        <Image
          width={40}
          height={40}
          source={
            props.image
              ? { uri: props.image }
              : require("../../../assets/default_user.png")
          }
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
  },
});
