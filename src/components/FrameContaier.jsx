import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";

import InputNumberModal from "./InputNumberModal";
import CONTEXT from "../context/CONTEXT";
import {
  calcMaxHeight,
  calcMaxWidth,
  calcMinHeight,
  percentageToNumber,
} from "../utils/util";

const FrameContainer = ({
  frameHeightValue,
  frameWidthValue,
  frameWidth,
  frameHeight,
  splitDirection,
  children,
}) => {
  if (!frameHeightValue || !frameWidthValue || !children) {
    return null;
  }

  const { readOnly, windowDimHeight, windowDimWidth, door } =
    useContext(CONTEXT);

  const [width, setWidth] = useState(frameWidth);
  const [height, setHeight] = useState(frameHeight);

  useEffect(() => {
    if (!frameWidth && !frameHeight) {
      if (Number(frameWidthValue) === Number(frameHeightValue)) {
        setHeight(calcMaxWidth());
        setWidth(calcMaxWidth());
      }
      if (Number(frameWidthValue) < Number(frameHeightValue)) {
        setHeight(calcMaxHeight());
        setWidth(calcMaxWidth());
      }
      if (Number(frameWidthValue) > Number(frameHeightValue)) {
        setWidth(calcMaxWidth());
        const max = Math.max(
          (frameHeightValue * calcMaxWidth()) / frameWidthValue,
          calcMinHeight(),
        );
        setHeight(max);
      }
    }
  }, [frameWidthValue, frameHeightValue]);

  return (
    <View
      style={[
        styles.container,
        {
          height,
          width,
          flexDirection: splitDirection === "h" ? "column" : "row",
        },
        door
          ? {
              borderBottomWidth: 0,
            }
          : null,
      ]}
    >
      {children}
      {!readOnly && (
        <>
          <HeightDim value={frameHeightValue} />
          <WidthDim value={frameWidthValue} />
        </>
      )}

      {!readOnly &&
        windowDimHeight &&
        windowDimHeight.map((ele, myIndex) => (
          <WindowDimHeight
            frameHeight={height}
            myProps={ele}
            key={myIndex}
            myIndex={myIndex}
          />
        ))}

      {!readOnly &&
        windowDimWidth &&
        width &&
        windowDimWidth.map((ele, myIndex) => (
          <WindowDimWidth
            frameWidth={width}
            myProps={ele}
            key={myIndex}
            myIndex={myIndex}
          />
        ))}
    </View>
  );
};

const HeightDim = ({ value }) => {
  const [visible, setVisible] = useState(false);
  const { changeFrameHeight } = useContext(CONTEXT);

  return (
    <View style={[styles.heightDimContainer]}>
      <InputNumberModal
        visible={visible}
        setVisible={setVisible}
        value={value.toString() || ""}
        setValue={changeFrameHeight}
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

const WidthDim = ({ value }) => {
  if (value === undefined) return null;
  const [visible, setVisible] = useState(false);
  const { changeFrameWidth } = useContext(CONTEXT);

  return (
    <View style={[styles.widthDimContainer]}>
      <InputNumberModal
        visible={visible}
        setVisible={setVisible}
        value={value}
        setValue={changeFrameWidth}
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

const WindowDimHeight = ({ frameHeight }) => {
  const { windowDimHeight, frameHeightValue } = useContext(CONTEXT);
  if (!windowDimHeight) return null;

  const dims = windowDimHeight.map((ele, index) => {
    const myHeight = (percentageToNumber(ele.height) * frameHeight) / 100;
    const myHeightValue = Math.round(
      (percentageToNumber(ele.height) * frameHeightValue) / 100,
    );

    if (!myHeight) return null;

    return (
      <WindowDimHeightView
        key={index}
        myHeightValue={myHeightValue}
        myHeight={myHeight}
        index={index}
        windowDimHeight={windowDimHeight}
      />
    );
  });

  return <View style={{ position: "absolute", right: -40 }}>{dims}</View>;
};

const WindowDimHeightView = ({
  myHeight,
  myHeightValue,
  index,
  windowDimHeight,
}) => {
  const { frameHeightValue, data, changeHeightOfStack } = useContext(CONTEXT);

  const [modalValue, setModalValue] = useState(myHeightValue.toString());
  const [visible, setVisible] = useState(false);
  const { parentIndex, myIndex } = windowDimHeight[index];
  const dataCopy = JSON.parse(JSON.stringify(data));

  function handleChangeHeight(newHeight) {
    if (isNaN(Number(newHeight)) || Number(newHeight) === 0) return null;
    const MIN_VALUE = 300;

    let oldValue = myHeightValue;
    let newValue = Number(newHeight);

    if (oldValue > newValue) {
      newValue = Math.max(MIN_VALUE, newValue);
      const newVP = (newValue * 100) / frameHeightValue;
      const oldVp = percentageToNumber(windowDimHeight[myIndex].height);
      let restVP = oldVp - newVP;

      if (windowDimHeight[myIndex + 1]) {
        const nextVP =
          percentageToNumber(windowDimHeight[myIndex + 1].height) + restVP;

        for (let i = 0; i < parentIndex.length; i++) {
          dataCopy.children[parentIndex[i]].props.children[myIndex].height =
            `${newVP}%`;
        }

        for (
          let i = 0;
          i < windowDimHeight[myIndex + 1].parentIndex.length;
          i++
        ) {
          dataCopy.children[parentIndex[i]].props.children[myIndex + 1].height =
            `${nextVP}%`;
        }
      } else {
        const firstVP = percentageToNumber(windowDimHeight[0].height) + restVP;

        for (let i = 0; i < parentIndex.length; i++) {
          dataCopy.children[parentIndex[i]].props.children[myIndex].height =
            `${newVP}%`;
        }

        for (let i = 0; i < windowDimHeight[0].parentIndex.length; i++) {
          dataCopy.children[parentIndex[i]].props.children[0].height =
            `${firstVP}%`;
        }
      }
    } else if (oldValue < newValue) {
      const MAX_VALUE =
        frameHeightValue - MIN_VALUE * (windowDimHeight.length - 1);
      const MIN_VP = (MIN_VALUE * 100) / frameHeightValue;
      newValue = Math.min(MAX_VALUE, newValue);
      const newVP = (newValue * 100) / frameHeightValue;
      const oldVp = percentageToNumber(windowDimHeight[myIndex].height);
      let restVP = newVP - oldVp;

      for (let i = 0; i < parentIndex.length; i++) {
        dataCopy.children[parentIndex[i]].props.children[myIndex].height =
          `${newVP}%`;
      }

      for (let i = myIndex + 1; i < windowDimHeight.length; i++) {
        const currentMyIndex = windowDimHeight[i].myIndex;
        const parentIndex = windowDimHeight[i].parentIndex;

        let currentHeightVP = percentageToNumber(
          dataCopy.children[parentIndex[0]].props.children[currentMyIndex]
            .height,
        );
        if (currentHeightVP - restVP < MIN_VP) {
          for (let j = 0; j < parentIndex.length; j++) {
            dataCopy.children[parentIndex[j]].props.children[
              currentMyIndex
            ].height = `${MIN_VP}%`;
          }
          restVP = restVP - (currentHeightVP - MIN_VP);
        } else {
          const currentMyIndex = windowDimHeight[i].myIndex;
          const parentIndex = windowDimHeight[i].parentIndex;
          for (let j = 0; j < parentIndex.length; j++) {
            dataCopy.children[parentIndex[j]].props.children[
              currentMyIndex
            ].height = `${currentHeightVP - restVP}%`;
          }
          restVP = 0;
          break;
        }
      }

      for (let i = 0; i < myIndex && restVP > 0; i++) {
        const currentMyIndex = windowDimHeight[i].myIndex;
        const parentIndex = windowDimHeight[i].parentIndex;
        let currentHeightVP = percentageToNumber(
          dataCopy.children[parentIndex[0]].props.children[currentMyIndex]
            .height,
        );
        if (currentHeightVP - restVP < MIN_VP) {
          for (let j = 0; j < parentIndex.length; j++) {
            dataCopy.children[parentIndex[j]].props.children[
              currentMyIndex
            ].height = `${MIN_VP}%`;
          }
          restVP = restVP - (currentHeightVP - MIN_VP);
        } else {
          const currentMyIndex = windowDimHeight[i].myIndex;
          const parentIndex = windowDimHeight[i].parentIndex;
          for (let j = 0; j < parentIndex.length; j++) {
            dataCopy.children[parentIndex[j]].props.children[
              currentMyIndex
            ].height = `${currentHeightVP - restVP}%`;
          }
          restVP = 0;
          break;
        }
      }
    }
    changeHeightOfStack(dataCopy);
    setModalValue(newValue);
  }

  return (
    <View
      style={{
        height: myHeight || "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <InputNumberModal
        visible={visible}
        setVisible={setVisible}
        setModalValue={setModalValue}
        value={modalValue}
        setValue={handleChangeHeight}
        title={"set the frame width"}
      />
      <View style={styles.side} />
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text style={styles.text}>{myHeightValue}</Text>
      </TouchableOpacity>
      <View style={styles.side} />
    </View>
  );
};

const WindowDimWidth = ({ frameWidth }) => {
  const { windowDimWidth, frameWidthValue } = useContext(CONTEXT);
  if (!windowDimWidth) return null;

  const dims = windowDimWidth.map((ele, index) => {
    const myWidth = (percentageToNumber(ele.width) * frameWidth) / 100;
    const myWidthValue = Math.round(
      (percentageToNumber(ele.width) * frameWidthValue) / 100,
    );

    return (
      <WindowDimWidthView
        key={index}
        myWidthValue={myWidthValue}
        myWidth={myWidth}
        index={index}
        windowDimWidth={windowDimWidth}
      />
    );
  });

  return (
    <View
      style={{
        position: "absolute",
        top: -30,
        flexDirection: "row",
      }}
    >
      {dims}
    </View>
  );
};

const WindowDimWidthView = ({
  myWidth,
  myWidthValue,
  index,
  windowDimWidth,
}) => {
  const { frameWidthValue, data, changeHeightOfStack } = useContext(CONTEXT);

  const [modalValue, setModalValue] = useState(myWidthValue.toString());
  const [visible, setVisible] = useState(false);
  const { parentIndex, myIndex } = windowDimWidth[index];
  const dataCopy = JSON.parse(JSON.stringify(data));

  function handleChangeWidth(newWidth) {
    if (isNaN(Number(newWidth)) || Number(newWidth) === 0) return null;
    const MIN_VALUE = 300;

    let oldValue = myWidthValue;
    let newValue = Number(newWidth);

    if (oldValue > newValue) {
      newValue = Math.max(MIN_VALUE, newValue);
      const newVP = (newValue * 100) / frameWidthValue;
      const oldVp = percentageToNumber(windowDimWidth[myIndex].width);
      let restVP = oldVp - newVP;

      if (windowDimWidth[myIndex + 1]) {
        const nextVP =
          percentageToNumber(windowDimWidth[myIndex + 1].width) + restVP;

        for (let i = 0; i < parentIndex.length; i++) {
          dataCopy.children[parentIndex[i]].props.children[myIndex].width =
            `${newVP}%`;
        }

        for (
          let i = 0;
          i < windowDimWidth[myIndex + 1].parentIndex.length;
          i++
        ) {
          dataCopy.children[parentIndex[i]].props.children[myIndex + 1].width =
            `${nextVP}%`;
        }
      } else {
        const firstVP = percentageToNumber(windowDimWidth[0].width) + restVP;

        for (let i = 0; i < parentIndex.length; i++) {
          dataCopy.children[parentIndex[i]].props.children[myIndex].width =
            `${newVP}%`;
        }

        for (let i = 0; i < windowDimWidth[0].parentIndex.length; i++) {
          dataCopy.children[parentIndex[i]].props.children[0].width =
            `${firstVP}%`;
        }
      }
    } else if (oldValue < newValue) {
      const MAX_VALUE =
        frameWidthValue - MIN_VALUE * (windowDimWidth.length - 1);
      const MIN_VP = (MIN_VALUE * 100) / frameWidthValue;
      newValue = Math.min(MAX_VALUE, newValue);
      const newVP = (newValue * 100) / frameWidthValue;
      const oldVp = percentageToNumber(windowDimWidth[myIndex].width);
      let restVP = newVP - oldVp;

      for (let i = 0; i < parentIndex.length; i++) {
        dataCopy.children[parentIndex[i]].props.children[myIndex].width =
          `${newVP}%`;
      }

      for (let i = myIndex + 1; i < windowDimWidth.length; i++) {
        const currentMyIndex = windowDimWidth[i].myIndex;
        const parentIndex = windowDimWidth[i].parentIndex;
        let currentWidthVP = percentageToNumber(
          dataCopy.children[parentIndex[0]].props.children[currentMyIndex]
            .width,
        );

        if (currentWidthVP - restVP < MIN_VP) {
          for (let j = 0; j < parentIndex.length; j++) {
            dataCopy.children[parentIndex[j]].props.children[
              currentMyIndex
            ].width = `${MIN_VP}%`;
          }
          restVP = restVP - (currentWidthVP - MIN_VP);
        } else {
          for (let j = 0; j < parentIndex.length; j++) {
            dataCopy.children[parentIndex[j]].props.children[
              currentMyIndex
            ].width = `${currentWidthVP - restVP}%`;
          }
          restVP = 0;
          break;
        }
      }

      for (i = 0; i < myIndex && restVP > 0; i++) {
        const currentMyIndex = windowDimWidth[i].myIndex;
        const parentIndex = windowDimWidth[i].parentIndex;

        let currentWidthVP = percentageToNumber(
          dataCopy.children[parentIndex[i]].props.children[currentMyIndex]
            .width,
        );

        if (currentWidthVP - restVP < MIN_VP) {
          for (let j = 0; j < parentIndex.length; j++) {
            dataCopy.children[parentIndex[j]].props.children[
              currentMyIndex
            ].width = `${MIN_VP}%`;
          }
          restVP = restVP - (currentWidthVP - MIN_VP);
        } else {
          for (let j = 0; j < parentIndex.length; j++) {
            dataCopy.children[parentIndex[j]].props.children[
              currentMyIndex
            ].width = `${currentWidthVP - restVP}%`;
          }
          restVP = 0;
          break;
        }
      }
    }
    changeHeightOfStack(dataCopy);
    setModalValue(newValue);
  }

  return (
    <View
      style={{
        width: myWidth || "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        gap: 3,
      }}
    >
      <InputNumberModal
        visible={visible}
        setVisible={setVisible}
        setModalValue={setModalValue}
        value={modalValue}
        setValue={handleChangeWidth}
        title={"set the frame width"}
      />
      <View style={styles.widthSide} />
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text style={styles.text}>{myWidthValue}</Text>
      </TouchableOpacity>
      <View style={styles.widthSide} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: "white",
    position: "relative",
  },
  heightDimContainer: {
    position: "absolute",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: -45,
    gap: 5,
    overflow: "hidden",
  },
  widthDimContainer: {
    flexDirection: "row",
    position: "absolute",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    left: 0,
    bottom: -50,
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
  windowHeightDimContainer: {
    position: "absolute",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: -30,
    gap: 5,
    overflow: "hidden",
  },
  text: {
    fontSize: 9,
  },
});

export default FrameContainer;
