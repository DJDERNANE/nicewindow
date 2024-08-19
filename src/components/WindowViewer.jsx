import React, { useContext, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import CONTEXT from "../context/CONTEXT";
import WindowStyle from "./Modals/WindowStyle";
import linesStyles from "../../WindowStyle.json";
import WindowExample from "./WindowExample";

const WindowViewer = ({ parentIndex, index, modelIndex }) => {
  const { readOnly, changeIndexModel, color } = useContext(CONTEXT);
  function handleChangingIndex(newIndex) {
    if (newIndex !== undefined && newIndex !== null) {
      return changeIndexModel(parentIndex, index, newIndex);
    }
  }

  const [visible, setVisible] = useState(false);

  const elementSvg = modelIndex;
  const newElement = linesStyles[elementSvg];

  return (
    <View style={[styles.container, { height: "100%", width: "100%" }]}>
      <View style={{ overflow: "hidden" }}>
        <WindowExample color={color} lineStyle={newElement} />
      </View>
      {!readOnly && modelIndex < 10 && (
        <>
          <View style={[styles.item]}>
            <TouchableOpacity onPress={() => setVisible(true)}>
              <View style={styles.button}>
                <AntDesign name="plus" size={40} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
          <WindowStyle
            visible={visible}
            setVisible={setVisible}
            currentIndex={index}
            stackIndex={parentIndex}
            setModelIndex={handleChangingIndex}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  item: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    height: 40,
    width: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(142, 180, 225, 0.57)",
    borderRadius: 50,
  },
});

export default WindowViewer;
