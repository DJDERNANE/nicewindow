import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import CONTEXT from "../context/CONTEXT";

const Pass = ({ direction }) => {
  const { footer } = useContext(CONTEXT);

  const directionView = {
    top: {
      container: {
        right: "50%",
        top: !footer ? 1 : -1,
        transform: [{ translateX: !footer ? -5 : -2 }],
        height: !footer ? 8 : 4,
        width: !footer ? 8 : 4,
      },
      inner: {
        width: !footer ? 13 : 5,
        height: !footer ? 4 : 1,
        left: !footer ? 2 : 1,
        top: !footer ? 1.3 : 0,
      },
    },
    left: {
      container: {
        top: "50%",
        left: !footer ? 1 : -1,
        transform: [{ translateY: !footer ? 5 : 2 }],
        height: !footer ? 8 : 4,
        width: !footer ? 8 : 4,
      },
      inner: {
        height: !footer ? 13 : 5,
        width: !footer ? 4 : 1,
        top: !footer ? 2 : 1,
        left: !footer ? 1.3 : 0,
      },
    },
    bottom: {
      container: {
        right: "50%",
        bottom: !footer ? 1 : -1,
        transform: [{ translateX: !footer ? -5 : -2 }],
        height: !footer ? 8 : 4,
        width: !footer ? 8 : 4,
      },
      inner: {
        width: !footer ? 13 : 5,
        height: !footer ? 4 : 1,
        left: !footer ? 2 : 1,
        top: !footer ? 1.5 : 0,
      },
    },
    right: {
      container: {
        top: "50%",
        right: !footer ? 1 : -1,
        transform: [{ translateY: !footer ? 5 : 2 }],
        height: !footer ? 8 : 4,
        width: !footer ? 8 : 4,
      },
      inner: {
        height: !footer ? 13 : 5,
        width: !footer ? 4 : 1,
        top: !footer ? 2 : 1,
        left: !footer ? 1.3 : 0,
      },
    },
  };

  return (
    <View
      style={[
        directionView[direction || "left"].container,
        styles.container,
      ]}
    >
      <View
        style={[styles.inner, directionView[direction || "left"].inner]}
      >
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    // height: 8,
    // width: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderStyle: "solid",
    zIndex: 1000,
  },
  inner: {
    backgroundColor: "white",
    borderWidth: 1,
    borderStyle: "solid",
  },
});

export default Pass;
