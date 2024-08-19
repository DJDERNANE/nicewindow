import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";

import WindowViewer from "./WindowViewer";
import InputNumberModal from "./InputNumberModal";
import CONTEXT from "../context/CONTEXT";
import { isColorDark, percentageToNumber } from "../utils/util";

const HStack = ({ childrenProps, myIndex, myProps }) => {
  const {
    childrenDimHeight,
    childrenDimWidth,
    readOnly,
    color,
    footer,
    door,
    data,
  } = useContext(CONTEXT);

  return (
    <View
      style={[
        styles.container,
        {
          height: myProps?.height || "100%",
          width: myProps?.width || "100%",
          backgroundColor: color,
          borderColor: isColorDark(color) ? "white" : "black",
          borderWidth:
            data?.children[myIndex]?.props?.children[0]?.modelIndex === 10
              ? 0
              : 1,
          padding:
            data?.children[myIndex]?.props?.children[0]?.modelIndex === 10
              ? 0
              : 5,
        },
        footer ? { padding: 2 } : null,
        door
          ? {
            borderBottomWidth: 0,
            paddingBottom: 0,
          }
          : null,
      ]}
    >
      <View
        style={[
          styles.windowsWraper,
          {
            borderColor: isColorDark(color) ? "white" : "black",
          },
          footer ? { gap: 2 } : null,
        ]}
      >
        {childrenProps.map((child, index) => {
          return (
            <View
              style={[
                {
                  height: child.height || "100%",
                  width: child.width || "100%",
                  borderBottomWidth: index < childrenProps.length - 1 ? 1 : 0,
                  overflow: "hidden",

                  borderTopWidth:
                    index > 0 && index === childrenProps.length - 1 ? 1 : 0,
                  borderStyle: "solid",
                },
              ]}
              key={index}
            >
              <WindowViewer {...child} index={index} parentIndex={myIndex} />
            </View>
          );
        })}
      </View>
      {!readOnly && childrenDimHeight && <HeightDim myIndex={myIndex} />}

      {!readOnly && childrenDimWidth && <WidthDim myIndex={myIndex} />}
    </View>
  );
};

const HeightDim = ({ myIndex }) => {
  const { childrenDimHeight, frameHeightValue, changeHeightOfStack, data } =
    useContext(CONTEXT);
  const dataCopy = JSON.parse(JSON.stringify(data));
  if (dataCopy.children[myIndex] === undefined) return null;

  const value = childrenDimHeight[myIndex].heightValue.toString();
  const [visible, setVisible] = useState(false);
  const [modalValue, setModalValue] = useState(value);

  function handleHeightChange(newHeight) {
    if (isNaN(Number(newHeight)) || Number(newHeight) === 0) return null;
    const MIN_VALUE = 100;

    let oldValue = childrenDimHeight[myIndex].heightValue;
    let newValue = Number(newHeight);

    if (oldValue > newValue) {
      newValue = Math.max(MIN_VALUE, newValue);
      const newVP = (newValue * 100) / frameHeightValue;
      const oldVp = percentageToNumber(dataCopy.children[myIndex].props.height);
      let restVP = oldVp - newVP;

      if (dataCopy.children[myIndex + 1]) {
        const nextVP =
          percentageToNumber(dataCopy.children[myIndex + 1].props.height) +
          restVP;

        dataCopy.children[myIndex].props.height = `${newVP}%`;
        dataCopy.children[myIndex + 1].props.height = `${nextVP}%`;
      } else {
        const firstVP =
          percentageToNumber(dataCopy.children[0].props.height) + restVP;
        dataCopy.children[myIndex].props.height = `${newVP}%`;
        dataCopy.children[0].props.height = `${firstVP}%`;
      }
    } else if (oldValue < newValue) {
      const MAX_VALUE =
        frameHeightValue - MIN_VALUE * (dataCopy.children.length - 1);
      const MIN_VP = (MIN_VALUE * 100) / frameHeightValue;
      newValue = Math.min(MAX_VALUE, newValue);
      const newVP = (newValue * 100) / frameHeightValue;
      const oldVp = percentageToNumber(dataCopy.children[myIndex].props.height);
      let restVP = newVP - oldVp;

      dataCopy.children[myIndex].props.height = `${newVP}%`;

      for (let i = myIndex + 1; i < dataCopy.children.length; i++) {
        let currentHeightVP = percentageToNumber(
          dataCopy.children[i].props.height,
        );

        if (currentHeightVP - restVP < MIN_VP) {
          dataCopy.children[i].props.height = `${MIN_VP}%`;
          restVP = restVP - (currentHeightVP - MIN_VP);
        } else {
          dataCopy.children[i].props.height = `${currentHeightVP - restVP}%`;
          restVP = 0;
          break;
        }
      }

      for (let i = 0; i < myIndex && restVP > 0; i++) {
        let currentHeightVP = percentageToNumber(
          dataCopy.children[i].props.height,
        );

        if (currentHeightVP - restVP < MIN_VP) {
          dataCopy.children[i].props.height = `${MIN_VP}%`;
          restVP = restVP - (currentHeightVP - MIN_VP);
        } else {
          dataCopy.children[i].props.height = `${MIN_VP}%`;
          restVP = 0;
          break;
        }
      }
    }

    changeHeightOfStack(dataCopy);
    setModalValue(newValue);
  }

  return (
    <View style={[styles.heightDimContainer]}>
      <InputNumberModal
        visible={visible}
        setVisible={setVisible}
        value={modalValue}
        setValue={handleHeightChange}
        title={"set the frame height"}
      />
      <View style={styles.side} />
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text style={styles.text}>{value}</Text>
      </TouchableOpacity>
      <View style={styles.side} />
    </View>
  );
};

const WidthDim = ({ myIndex }) => {
  const { childrenDimWidth, frameWidthValue, changeWidthOfStack, data } =
    useContext(CONTEXT);
  const dataCopy = JSON.parse(JSON.stringify(data));
  if (dataCopy.children[myIndex] === undefined) return null;

  const value = childrenDimWidth[myIndex].widthValue.toString();
  const [visible, setVisible] = useState(false);
  const [modalValue, setModalValue] = useState(value);

  function handleWidthChange(newWidth) {
    if (isNaN(Number(newWidth)) || Number(newWidth) === 0) return null;
    const MIN_VALUE = 100;

    let oldValue = childrenDimWidth[myIndex].widthValue;
    let newValue = Number(newWidth);

    if (oldValue > newValue) {
      newValue = Math.max(MIN_VALUE, newValue);
      const newVP = (newValue * 100) / frameWidthValue;
      const oldVp = percentageToNumber(dataCopy.children[myIndex].props.width);
      let restVP = oldVp - newVP;

      if (dataCopy.children[myIndex + 1]) {
        const nextVP =
          percentageToNumber(dataCopy.children[myIndex + 1].props.width) +
          restVP;

        dataCopy.children[myIndex].props.width = `${newVP}%`;
        dataCopy.children[myIndex + 1].props.width = `${nextVP}%`;
      } else {
        const firstVP =
          percentageToNumber(dataCopy.children[0].props.width) + restVP;
        dataCopy.children[myIndex].props.width = `${newVP}%`;
        dataCopy.children[0].props.width = `${firstVP}%`;
      }
    } else if (oldValue < newValue) {
      const MAX_VALUE =
        frameWidthValue - MIN_VALUE * (dataCopy.children.length - 1);
      const MIN_VP = (MIN_VALUE * 100) / frameWidthValue;
      newValue = Math.min(MAX_VALUE, newValue);
      const newVP = (newValue * 100) / frameWidthValue;
      const oldVp = percentageToNumber(dataCopy.children[myIndex].props.width);
      let restVP = newVP - oldVp;

      dataCopy.children[myIndex].props.width = `${newVP}%`;

      for (let i = myIndex + 1; i < dataCopy.children.length; i++) {
        let currentWidthVP = percentageToNumber(
          dataCopy.children[i].props.width,
        );

        if (currentWidthVP - restVP < MIN_VP) {
          dataCopy.children[i].props.width = `${MIN_VP}%`;
          restVP = restVP - (currentWidthVP - MIN_VP);
        } else {
          dataCopy.children[i].props.width = `${currentWidthVP - restVP}%`;
          restVP = 0;
          break;
        }
      }

      for (let i = 0; i < myIndex && restVP > 0; i++) {
        let currentWidthVP = percentageToNumber(
          dataCopy.children[i].props.width,
        );

        if (currentWidthVP - restVP < MIN_VP) {
          dataCopy.children[i].props.width = `${MIN_VP}%`;
          restVP = restVP - (currentWidthVP - MIN_VP);
        } else {
          dataCopy.children[i].props.width = `${MIN_VP}%`;
          restVP = 0;
          break;
        }
      }
    }

    changeWidthOfStack(dataCopy);
    setModalValue(newWidth);
  }

  return (
    <View style={[styles.widthDimContainer]}>
      <InputNumberModal
        visible={visible}
        setVisible={setVisible}
        value={modalValue}
        setValue={handleWidthChange}
        title={"set the frame width"}
      />
      <View style={styles.widthSide} />
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text style={styles.text}>{value}</Text>
      </TouchableOpacity>
      <View style={styles.widthSide} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 5,
    borderWidth: 1,
    borderStyle: "solid",
  },
  windowsWraper: {
    height: "100%",
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    overflow: "hidden",
    gap: 5,
  },
  heightDimContainer: {
    position: "absolute",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: -25,
    overflow: "hidden",
  },
  widthDimContainer: {
    flexDirection: "row",
    position: "absolute",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    left: 0,
    bottom: -30,
    gap: 5,
    overflow: "hidden",
  },

  side: {
    height: "100%",
    width: 2,
    backgroundColor: "black",
  },
  widthSide: {
    width: "100%",
    height: 2,
    backgroundColor: "black",
  },
  text: {
    fontSize: 9,
  },
});

export default HStack;
