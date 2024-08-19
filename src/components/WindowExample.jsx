import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Svg, { Line } from "react-native-svg";

import Pass from "./Pass";
import CONTEXT from "../context/CONTEXT";
import { isColorDark } from "../utils/util";

const WindowExample = ({ color, height, width, lineStyle }) => {
  const { footer, door } = useContext(CONTEXT);
  const [isDark, setIsDark] = useState(null);

  useEffect(() => {
    if (isColorDark(color)) {
      setIsDark(true);
    } else setIsDark(false);
  }, [color]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color || "#ffffff",
          borderColor: isDark ? "white" : "black",
          width,
          height,
        },
        footer ? { padding: 3 } : null,
        lineStyle?.padding === 0 ? { padding: 2 } : null,
        lineStyle?.padding === 0 && lineStyle?.voli
          ? { padding: 0, borderWidth: 0 }
          : null,
      ]}
    >
      {lineStyle?.direction && <Pass direction={lineStyle.direction} />}
      <View style={[styles.rect, { borderColor: isDark ? "white" : "black" }]}>
        {lineStyle?.voli ? (
          <View
            style={[
              styles.voli,
              color ? { backgroundColor: color } : {},
              door ? { borderBottomWidth: 0 } : null,
            ]}
          >
            <View
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                zIndex: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  backgroundColor: "white",
                  color: "black",
                  fontWeight: "900",
                }}
              >
                Voli
              </Text>
            </View>
            {Array(4)
              .fill(0)
              .map((_, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      position: "relative",
                      width: "100%",
                      marginTop: 4,
                      borderStyle: "solid",
                      borderTopWidth: 1,
                      borderWidth: 1,
                      borderColor: isDark ? "white" : "black",
                      zIndex: -1,
                    }}
                  />
                );
              })}
          </View>
        ) : (
          <Svg
            height={"100%"}
            width={"100%"}
            style={{ backgroundColor: "rgba(142, 180, 225, 0.57)" }}
          >
            {lineStyle?.lines?.map((ele, index) => (
              <Line key={index} {...ele} />
            ))}
          </Svg>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 200,
    height: 200,
    padding: 10,
    borderWidth: 1,
    borderStyle: "solid",
  },
  rect: {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderStyle: "solid",
  },
  voli: {
    justifyContent: "space-evenly",
    height: "100%",
    width: "100%",
    overflow: "hidden",
    position: "absolute",
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default WindowExample;