import React, { useEffect } from "react";
import { unit } from "mathjs";
import { isEqual, difference } from "lodash";

import CONTEXT from "../context/CONTEXT";
import FrameContaier from "./FrameContaier";
import HStack from "./HStack";
import VStack from "./VStack";

// export const CONTEXT = createContext(null);

const JsonToJSX = ({
  jsonString,
  defaultProps,
  readOnly,
  updateCurrentShape,
  footer,
}) => {
  if (!isJsonString(jsonString)) {
    return null;
  }

  const json = JSON.parse(jsonString);
  const { props, children, changed, params } = json;

  const newProps = setupFrameProps({ ...props, ...defaultProps });
  const newChildren = setupStackProps(newProps, children, changed);
  const childrenDimHeight = !readOnly
    ? returnChildrenDimHeight(newProps, newChildren)
    : null;
  const childrenDimWidth = !readOnly
    ? returnChildrenDimWidth(newProps, newChildren)
    : null;

  let newJson = returnNewJson();

  function returnNewJson() {
    if (readOnly) return null;

    const arr = [];
    for (let i = 0; i < children.length; i++) {
      arr.push({
        props: { ...children[i].props, ...newChildren[i] },
        type: children[i].type,
      });
    }
    const newJson = { props: newProps, children: arr, params };

    return newJson;
  }

  async function changeFrameHeight(newHeight) {
    if (newJson === null) return;

    newJson.props.frameHeightValue = newHeight;

    return await updateCurrentShape(newJson);
  }

  async function changeFrameWidth(newHeight) {
    if (newJson === null) return;

    newJson.props.frameWidthValue = newHeight;

    return await updateCurrentShape(newJson);
  }

  async function changeIndexModel(parentIndex, myIndex, newIndex) {
    newJson.children[parentIndex].props.children[myIndex].modelIndex = newIndex;
    await updateCurrentShape(newJson);
    return;
  }

  async function changeHeightOfStack(newData) {
    await updateCurrentShape(newData);
    return;
  }

  async function changeWidthOfStack(newData) {
    await updateCurrentShape(newData);
    return;
  }

  const windowDimHeight = !readOnly ? returnWindowDimHeight(newJson) : null;
  const windowDimWidth = !readOnly ? returnWindowDimWidth(newJson) : null;

  const value = {
    readOnly,
    childrenDimHeight,
    childrenDimWidth,
    windowDimHeight,
    windowDimWidth,
    changeFrameHeight,
    changeFrameWidth,
    changeIndexModel,
    changeWidthOfStack,
    changeHeightOfStack,
    frameHeightValue: newProps.frameHeightValue,
    frameWidthValue: newProps.frameWidthValue,
    data: newJson,
    stacks: newChildren,
    color: params?.color?.color || "#ffffff",
    footer: footer || false,
    door: json?.props?.door,
  };

  return (
    <CONTEXT.Provider value={value}>
      <FrameContaier {...newProps}>
        {children &&
          children.map((child, index) =>
            renderChildrenProps(child, index, newChildren),
          )}
      </FrameContaier>
    </CONTEXT.Provider>
  );
};

function setupFrameProps(props) {
  let newProps = { ...props };

  if (!newProps?.frameHeightValue) {
    newProps = { ...newProps, frameHeightValue: 1500 };
  }

  if (!newProps?.frameWidthValue) {
    newProps = { ...newProps, frameWidthValue: 1500 };
  }

  if (!newProps?.splitDirection) {
    newProps = { ...newProps, splitDirection: "h" };
  }

  return newProps;
}

function setupStackProps(props, children, changed) {
  const length = children.length || 1;

  if (changed) {
    return children.map((ele) => ele.props);
  }

  if (props.equal === undefined || props.equal) {
    if (!props.splitDirection || props.splitDirection === "h") {
      const arr = [];

      for (let i = 0; i < length; i++) {
        arr.push({
          height: `${100 / length}%`,
          children: returnStackChildrens(children[i]),
        });
      }

      return arr;
    } else {
      const arr = [];

      for (let i = 0; i < length; i++) {
        arr.push({
          width: `${100 / length}%`,
          children: returnStackChildrens(children[i]),
        });
      }

      return arr;
    }
  } else {
    if (!props.splitDirection || props.splitDirection === "h") {
      const arr = [];
      arr.push({
        height: `${100 / (length + 1)}%`,
        children: returnStackChildrens(children[0]),
      });

      for (let i = 1; i < length; i++) {
        arr.push({
          height: `${(100 - 100 / (length + 1)) / (length - 1)}%`,
          children: returnStackChildrens(children[i]),
        });
      }

      return arr;
    } else {
      const arr = [];
      arr.push({
        width: `${100 / (length + 1)}%`,
        children: returnStackChildrens(children[0]),
      });

      for (let i = 1; i < length; i++) {
        arr.push({
          width: `${(100 - 100 / (length + 1)) / (length - 1)}%`,
          children: returnStackChildrens(children[i]),
        });
      }

      return arr;
    }
  }
}

function renderChildrenProps(child, index, stackProps) {
  let { type } = child;

  switch (type) {
    case "HWindow":
      return (
        <HStack
          key={index}
          childrenProps={stackProps[index].children || []}
          myIndex={index}
          myProps={stackProps[index]}
        />
      );
    case "VWindow":
      return (
        <VStack
          key={index}
          childrenProps={stackProps[index].children || []}
          myIndex={index}
          myProps={stackProps[index]}
        />
      );
    default:
      return null;
  }
}

function returnStackChildrens(props) {
  if (props.type === "HWindow") {
    return returnHStackChildren(props.props);
  } else if (props.type === "VWindow") {
    return returnVStackChildren(props.props);
  }
}

function returnHStackChildren(props) {
  let { length, equal, modelIndex } = props;
  if (!length) length = 1;

  if (equal === undefined || (equal === true && length === 1)) {
    return Array(length).fill({
      height: `${100 / length}%`,
      modelIndex: modelIndex === 0 ? 0 : modelIndex || 4,
    });
  }

  const first = [
    {
      height: `${100 / (length + 1)}%`,
      modelIndex: modelIndex === 0 ? 0 : modelIndex || 4,
    },
  ];
  const rest = Array(length - 1).fill({
    height: `${(100 - 100 / (length + 1)) / (length - 1)}%`,
    modelIndex: modelIndex === 0 ? 0 : modelIndex || 4,
  });

  return first.concat(rest);
}

function returnVStackChildren(props) {
  let { length, equal, modelIndex } = props;
  if (!length) length = 1;

  if (equal === undefined || (equal === true && length === 1)) {
    return Array(length).fill({
      width: `${100 / length}%`,
      modelIndex: modelIndex === 0 ? 0 : modelIndex || 4,
    });
  }

  const first = [
    {
      width: `${100 / (length + 1)}%`,
      modelIndex: modelIndex === 0 ? 0 : modelIndex || 4,
    },
  ];
  const rest = Array(length - 1).fill({
    width: `${(100 - 100 / (length + 1)) / (length - 1)}%`,
    modelIndex: modelIndex === 0 ? 0 : modelIndex || 4,
  });

  return first.concat(rest);
}

function returnChildrenDimHeight(props, childrenProps) {
  if (childrenProps.length <= 1) return null;

  if (props.splitDirection === "h") {
    return childrenProps.map((ele, index) => {
      const heightValue =
        (percentageToNumber(ele.height) * props.frameHeightValue) / 100;
      return { heightValue: Math.round(heightValue), myIndex: index };
    });
  }
  return null;
}

function returnChildrenDimWidth(props, childrenProps) {
  if (childrenProps.length <= 1) return null;

  if (props.splitDirection === "v") {
    return childrenProps.map((ele, index) => {
      const widthValue =
        (percentageToNumber(ele.width) * props.frameWidthValue) / 100;
      return { widthValue: Math.round(widthValue), myIndex: index };
    });
  }
  return null;
}

function returnWindowDimWidth(data) {
  if (data?.props?.splitDirection !== "h") return null;

  let returnArr = [];
  const children = data.children;

  const arr = [];
  for (let i = 0; i < children.length; i++) {
    if (
      children[i].type === "VWindow" &&
      children[i].props.children.length > 1
    ) {
      for (let j = 0; j < children[i].props.children.length; j++) {
        arr.push({
          parentIndex: i,
          myIndex: j,
          width: children[i].props.children[j].width,
        });
      }
    }
    const newArr = [];

    for (let i = 0; i < arr.length; i++) {
      let pushed = false;
      for (let j = 0; j < newArr.length; j++) {
        if (
          newArr[j].width === arr[i].width &&
          newArr[j].myIndex === arr[i].myIndex
        ) {
          newArr[j].parentIndex.push(arr[i].parentIndex);
          pushed = true;
        }
      }
      if (!pushed) {
        newArr.push({
          width: arr[i].width,
          myIndex: arr[i].myIndex,
          parentIndex: [arr[i].parentIndex],
        });
      }
    }
    returnArr = newArr;
  }
  return returnArr;
}

function returnWindowDimHeight(data) {
  if (data?.props?.splitDirection !== "v") return null;

  if (data.children.length < 2) return null;

  let returnArr = [];
  const children = data.children;

  const arr = [];
  for (let i = 0; i < children.length; i++) {
    if (
      children[i].type === "HWindow" &&
      children[i].props.children.length > 1
    ) {
      for (let j = 0; j < children[i].props.children.length; j++) {
        arr.push({
          parentIndex: i,
          myIndex: j,
          height: children[i].props.children[j].height,
        });
      }
    }
    const newArr = [];

    for (let i = 0; i < arr.length; i++) {
      let pushed = false;
      for (let j = 0; j < newArr.length; j++) {
        if (
          newArr[j].height === arr[i].height &&
          newArr[j].myIndex === arr[i].myIndex
        ) {
          newArr[j].parentIndex.push(arr[i].parentIndex);
          pushed = true;
        }
      }
      if (!pushed) {
        newArr.push({
          height: arr[i].height,
          myIndex: arr[i].myIndex,
          parentIndex: [arr[i].parentIndex],
        });
      }
    }
    returnArr = newArr;
  }
  return returnArr;
}

function calcAluminumLength(data) {
  if (!data) return null;
  const {
    props: { frameHeightValue, frameWidthValue, splitDirection },
    children,
  } = data;
  let sum = 0;
  sum += frameWidthValue * 2 + frameHeightValue * 2;
  if (splitDirection === "h") {
    sum += frameWidthValue * (children.length - 1);

    children.forEach((ele) => {
      const { type } = ele;
      if (type === "HWindow") {
        const parentHeight = Math.round(
          (percentageToNumber(ele.props.height) * frameHeightValue) / 100,
        );
        ele.props.children.forEach((child) => {
          const height = Math.round(
            (percentageToNumber(child.height) * parentHeight) / 100,
          );
          if (child.modelIndex !== 4) {
            sum += frameWidthValue * 2 + height * 2;
          }
        });

        sum += frameWidthValue * (ele.props.children.length - 1);
      } else {
        const parentHeight = Math.round(
          (percentageToNumber(ele.props.height) * frameHeightValue) / 100,
        );
        ele.props.children.forEach((child) => {
          const width = Math.round(
            (percentageToNumber(child.width) * frameWidthValue) / 100,
          );
          if (child.modelIndex !== 4) {
            sum += parentHeight * 2 + width * 2;
          }
        });
        sum += parentHeight * (ele.props.children.length - 1);
      }
    });
  } else {
    sum += frameHeightValue * (children.length - 1);

    children.forEach((ele) => {
      const { type } = ele;
      const parentWidth = Math.round(
        (percentageToNumber(ele.props.width) * frameWidthValue) / 100,
      );
      if (type === "HWindow") {
        ele.props.children.forEach((child) => {
          const height = Math.round(
            (percentageToNumber(child.height) * frameHeightValue) / 100,
          );

          if (child.modelIndex !== 4) {
            sum += parentWidth * 2 + height * 2;
          }
        });

        sum += parentWidth * (ele.props.children.length - 1);
      } else {
        ele.props.children.forEach((child) => {
          const width = Math.round(
            (percentageToNumber(child.width) * parentWidth) / 100,
          );
          if (child.modelIndex !== 4) {
            sum += frameHeightValue * 2 + width * 2;
          }
        });
        sum += frameHeightValue * (ele.props.children.length - 1);
      }
    });
  }
  return unit(sum, "mm").toNumber("m");
}

function calcGalssArea(data) {
  if (!data) return null;
  const {
    props: { frameHeightValue, frameWidthValue, splitDirection },
    children,
  } = data;
  let area = 0;
  if (splitDirection === "h") {
    children.forEach((ele) => {
      const { type } = ele;
      if (type === "HWindow") {
        const parentHeight = Math.round(
          (percentageToNumber(ele.props.height) * frameHeightValue) / 100,
        );
        ele.props.children.forEach((child) => {
          const height = Math.round(
            (percentageToNumber(child.height) * parentHeight) / 100,
          );
          if (child.modelIndex !== 4) {
            area += frameWidthValue * height;
          }
        });
      } else {
        const parentHeight = Math.round(
          (percentageToNumber(ele.props.height) * frameHeightValue) / 100,
        );
        ele.props.children.forEach((child) => {
          const width = Math.round(
            (percentageToNumber(child.width) * frameWidthValue) / 100,
          );
          if (child.modelIndex !== 4) {
            area += parentHeight * width;
          }
        });
      }
    });
  } else {
    children.forEach((ele) => {
      const { type } = ele;
      const parentWidth = Math.round(
        (percentageToNumber(ele.props.width) * frameWidthValue) / 100,
      );
      if (type === "HWindow") {
        ele.props.children.forEach((child) => {
          const height = Math.round(
            (percentageToNumber(child.height) * frameHeightValue) / 100,
          );

          if (child.modelIndex !== 4) {
            area += parentWidth * height;
          }
        });
      } else {
        ele.props.children.forEach((child) => {
          const width = Math.round(
            (percentageToNumber(child.width) * parentWidth) / 100,
          );
          if (child.modelIndex !== 4) {
            area += frameHeightValue * width;
          }
        });
      }
    });
  }
  return unit(area, "mm^2").toNumber("m^2").toFixed(3);
}

function isJsonString(json) {
  try {
    JSON.parse(json);
  } catch {
    return false;
  }
  return true;
}

function percentageToNumber(percentageString) {
  if (typeof percentageString !== "string") return null;
  const decimal = parseFloat(percentageString.replace("%", ""));

  if (!isNaN(decimal)) {
    return decimal;
  }
}

function isValidPercentageString(str) {
  // Remove leading and trailing whitespaces
  const trimmedStr = str.trim();

  // Check if the string ends with a percentage sign
  if (!trimmedStr.endsWith("%")) {
    return false;
  }

  // Remove the percentage sign and convert to a number
  const numberPart = trimmedStr.slice(0, -1);
  const numberValue = parseFloat(numberPart);

  // Check if the remaining part is a valid number
  return !isNaN(numberValue);
}

export default JsonToJSX;
