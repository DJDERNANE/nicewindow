import { Dimensions } from "react-native";

export function calcMaxWidth() {
  const percentage = 40;
  const screenWidth = Dimensions.get("screen").width;
  return Math.floor(screenWidth - (screenWidth * percentage) / 100);
}

export function calcMaxHeight() {
  const percentage = 60;
  const screenHeight = Dimensions.get("screen").height;
  return Math.floor(screenHeight - (screenHeight * percentage) / 100);
}

export function calcMinHeight() {
  const percentage = 1;
  const screenHeight = Dimensions.get("screen").height;
  return Math.floor((screenHeight * percentage) / 100);
}

export function calcMinWidth() {
  const percentage = 10;
  const screenWidth = Dimensions.get("screen").width;
  return Math.floor(screenWidth - (screenWidth * percentage) / 100);
}

export function calcTheGap(maxValue, children) {
  return maxValue / children;
}

export function extractNumberFromPercentageString(percentage) {
  if (typeof percentage === "string" && percentage.indexOf("%") > -1) {
    return Number(percentage.split("%")[0]);
  }
  console.log(percentage);
}

export function generateKey() {
  return Math.floor(Math.random() * 1000).toString();
}

export function percentageToNumber(percentageString) {
  if (typeof percentageString !== "string") return null;
  const decimal = parseFloat(percentageString.replace("%", ""));

  if (!isNaN(decimal)) {
    return decimal;
  }
}

export function percentageStringToNumber(percentageString) {
  if (typeof percentageString !== "string") {
    throw new Error("Input must be a string representing a percentage.");
  }

  const percentagePattern = /^(\d+(\.\d+)?)%\s*$/;
  const match = percentageString.match(percentagePattern);

  if (!match) {
    throw new Error("Invalid percentage string format.");
  }

  return parseFloat(match[1]);
}

export function isColorDark(hexColor) {
  // Remove the hash if it exists
  hexColor = hexColor.replace("#", "");

  // Expand three-character hex colors to six characters
  if (hexColor.length === 3) {
    hexColor = hexColor
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Convert the hex color to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Calculate the luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Choose a threshold value (you can adjust this)
  const threshold = 0.5;

  // If luminance is below the threshold, the color is considered dark
  return luminance <= threshold;
}
