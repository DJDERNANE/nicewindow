import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Cntxt from "../context/Cntxt";
import JsonToJSX from "./JsonToJSX";
import CanvasRightSlider from "./Modals/CanvasRightSlider";
import { GRAY, PRIMARY, SECONDARY } from "../styles/colors";

import { CARPENTRY_API_LINK } from "../utils/constants";

const Footer = ({ toggleCanvaModel }) => {
  const { setViewShapeIndex, viewShapeIndex, clientShapes, updateShape } = useContext(Cntxt);
  const [showRightSlide, setShowRightSlide] = useState(false);
  const [oldParams, setOldParams] = useState(null);

  const handleOnClose = async (params) => {
    if (!!clientShapes[viewShapeIndex]) {
      const newJson = JSON.parse(clientShapes[viewShapeIndex].shape);
      newJson.params = params;
      await updateShape(JSON.stringify(newJson), viewShapeIndex);
    }
    setShowRightSlide(false);
  };

  const allTheShapes = clientShapes.map((ele, index) => {
    return (
      <JsonToJSX
        footer={true}
        jsonString={ele.shape}
        key={index}
        readOnly
        defaultProps={{ frameHeight: 50, frameWidth: 70 }}
      />
    );
  });


  return (
    <View style={[styles.container]}>
      <IconBtn onPress={() => toggleCanvaModel(true)}>
        <AntDesign name="plus" size={30} color="white" />
      </IconBtn>

      <FlatList
        horizontal
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        data={allTheShapes}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => setViewShapeIndex(index)}>
              <View
                key={index}
                style={[
                  styles.item,
                  { backgroundColor: index === viewShapeIndex ? "#333" : null },
                ]}
              >
                {item}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <CanvasRightSlider
        isVisible={showRightSlide}
        onClose={() => setShowRightSlide(false)}
        updateParams={handleOnClose}
        oldParams={oldParams}
      />

      <IconBtn
        onPress={() => {
          if (clientShapes.length > 0) setShowRightSlide(true);
        }}
        backgroundColor={SECONDARY}
      >
        <MaterialCommunityIcons name="math-compass" size={30} color="#fff" />
      </IconBtn>
    </View>
  );
};

const IconBtn = ({ children, onPress, disable = false, backgroundColor }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disable}>
      <View
        style={[
          styles.iconBtn,
          backgroundColor ? { backgroundColor } : null,
          disable ? { backgroundColor: GRAY } : null,
        ]}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: PRIMARY,
    height: 50,
  },
  iconBtn: {
    width: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    height: "100%",
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Footer;
